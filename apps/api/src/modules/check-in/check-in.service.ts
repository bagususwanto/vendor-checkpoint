import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { VerifyCheckInDto } from './dto/verify-check-in.dto';
import { CheckoutCheckInDto } from './dto/checkout-check-in.dto';
import { HoldCheckInDto } from './dto/hold-check-in.dto';
import { ResumeCheckInDto } from './dto/resume-check-in.dto';
import { ArrivalCheckResponseDto } from './dto/arrival-check-response.dto';
import { SubmitDiscrepancyDto } from './dto/submit-discrepancy.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VendorService } from '../vendor/vendor.service';
import { generateQueueNumber } from 'src/common/utils/queue-number.util.';
import { SystemConfigService } from '../system-config/system-config.service';
import { extractSequence } from 'src/common/utils/extract-sequence.util';
import { ChecklistService } from '../checklist/checklist.service';
import { getStartOfToday } from 'src/common/utils/today-date.util';
import { getOperationalDate, getPlannedDateTime } from 'src/common/utils/operational-date.util';

// Removed TimeLogService import

import { toInt } from 'src/common/utils/string-to-int.util';
import { VendorCategoryService } from '../vendor_category/vendor_category.service';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import {
  DisplayQueue,
  PaginatedResponse,
  VerificationList,
  QueueStatus,
} from '@repo/types';

@Injectable()
export class CheckInService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorService,
    private readonly systemConfigService: SystemConfigService,
    private readonly checklistService: ChecklistService,
    private readonly vendorCategoryService: VendorCategoryService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Proxy PPE Detection request ke FastAPI service.
   * Frontend cukup panggil NestJS, tidak perlu tahu alamat FastAPI.
   */
  async detectPPE(imageBuffer: Buffer, mimetype: string): Promise<any> {
    const ppeServiceUrl =
      process.env.PPE_SERVICE_URL || 'http://localhost:8000';

    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: 'capture.jpg',
      contentType: mimetype,
    });

    try {
      const response = await this.httpService.axiosRef.post(
        `${ppeServiceUrl}/api/detect/?return_json=true`,
        form,
        { headers: form.getHeaders() },
      );

      // Jika FastAPI membungkus dalam field 'data', kita ambil isinya.
      // Jika tidak, kita ambil response.data langsung.
      return response.data?.data || response.data;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.response?.data?.detail ||
          'Gagal menghubungi layanan PPE Detection',
      );
    }
  }

  async create(createCheckInDto: CreateCheckInDto, requestInfo: any) {
    const maxRetries = 5;
    let attempt = 0;
    while (attempt < maxRetries) {
      const dateNow = new Date();
      try {
        return await this.prisma.$transaction(async (tx) => {
          // 1. Validate
          const vendor = await this.validateVendor(createCheckInDto.vendor_id);
          const vendorCategory = await this.validateVendorCategory(
            createCheckInDto.snapshot_vendor_category_id,
          );

          // 2. Generate Queue Number
          const queueNumber = await this.generateFormattedQueueNumber(tx);

          // 2.5 Slot Matching & Config
          const verificationModeConfig =
            await this.systemConfigService.findByConfigKey(
              'VERIFICATION_MODE_ENABLED',
            );
          const isVerificationEnabled =
            verificationModeConfig?.config_value === 'true';
          const initialStatus = isVerificationEnabled
            ? QueueStatus.MENUNGGU
            : QueueStatus.AKTIF;

          let slotId = null;
          const operationalDate = getOperationalDate(dateNow);

          const slot = await tx.ops_delivery_slot.findFirst({
            where: {
              schedule: {
                vendor_id: createCheckInDto.vendor_id,
              },
              expected_date: operationalDate,
              status: 'Open',
            },
            orderBy: {
              schedule: {
                arrival_time: 'asc',
              },
            },
          });

          if (slot) {
            slotId = slot.slot_id;
            await tx.ops_delivery_slot.update({
              where: { slot_id: slot.slot_id },
              data: { status: 'Filled' },
            });
          }

          // 3. Compliance Check
          // PPE scan dianggap non-compliant jika scan dilakukan tapi hasilnya bukan 'Pass'
          const ppeScanDone =
            createCheckInDto.ai_safety_status &&
            createCheckInDto.ai_safety_status !== 'Skipped' &&
            createCheckInDto.ppe_has_hardhat !== undefined &&
            createCheckInDto.ppe_has_safety_vest !== undefined;
          const ppeIsNonCompliant =
            ppeScanDone && createCheckInDto.ai_safety_status !== 'Pass';

          const { hasNonCompliantItems, nonCompliantCount } =
            this.calculateCompliance(
              createCheckInDto.checklist_responses,
              ppeIsNonCompliant,
            );

          // 4. Create CheckIn Entry
          const checkIn = await tx.ops_checkin_entry.create({
            data: {
              queue_number: queueNumber,
              vendor_id: createCheckInDto.vendor_id,
              driver_name: createCheckInDto.driver_name,
              dn_number: createCheckInDto.dn_number,
              po_number: createCheckInDto.po_number,
              slot_id: slotId,
              arrival_status: createCheckInDto.arrival_status,
              delay_arrival_reason_id: createCheckInDto.delay_arrival_reason_id,
              ai_safety_status: createCheckInDto.ai_safety_status || 'Pending',
              snapshot_vendor_category_id:
                createCheckInDto.snapshot_vendor_category_id ??
                vendor.vendor_category_id ??
                0,
              snapshot_company_name: vendor.company_name,
              snapshot_category_name: vendorCategory?.category_name ?? '',
              submission_time: dateNow,
              current_status: initialStatus,
              ip_address: requestInfo.ipAddress,
              device_identifier: requestInfo.deviceIdentifier,
              has_non_compliant_items: hasNonCompliantItems,
              non_compliant_count: nonCompliantCount,
            },
          });

          // 5. Process Checklist Responses
          await this.processChecklistResponses(
            tx,
            checkIn.entry_id,
            createCheckInDto.checklist_responses,
          );

          // 6. Create Queue Status
          await this.createQueueStatus(
            tx,
            checkIn.entry_id,
            queueNumber,
            dateNow,
            initialStatus,
          );

          // 7. Create Time Log
          await this.createTimeLog(tx, checkIn.entry_id, dateNow);

          // 8. Create PPE Scan Record jika APD detection dilakukan
          if (
            createCheckInDto.ai_safety_status &&
            createCheckInDto.ai_safety_status !== 'Skipped' &&
            createCheckInDto.ppe_has_hardhat !== undefined &&
            createCheckInDto.ppe_has_safety_vest !== undefined
          ) {
            await this.createPpeScan(
              tx,
              checkIn.entry_id,
              createCheckInDto,
              dateNow,
            );
          }

          // Audit log moved to interceptor

          const estimatedWaitMinutes =
            await this.systemConfigService.findByConfigKey(
              'ESTIMATED_WAIT_MINUTES',
            );

          const statusDisplayTextKey =
            initialStatus === QueueStatus.AKTIF
              ? 'DEFAULT_STATUS_AKTIF_DISPLAY_TEXT'
              : 'DEFAULT_STATUS_MENUNGGU_DISPLAY_TEXT';

          const statusDisplayText =
            await this.systemConfigService.findByConfigKey(
              statusDisplayTextKey,
            );

          // 9. Return Result
          return {
            entry_id: checkIn.entry_id, // For Audit Log
            queue_number: queueNumber,
            company_name: vendor.company_name,
            driver_name: createCheckInDto.driver_name,
            status_display_text:
              statusDisplayText?.config_value ||
              (initialStatus === QueueStatus.AKTIF ? 'Diterima' : 'Menunggu'),
            estimated_wait_minutes: estimatedWaitMinutes?.config_value
              ? toInt(estimatedWaitMinutes.config_value)
              : 0,
            submission_time: dateNow,
          };
        });
      } catch (error: any) {
        if (
          error.code === 'P2002' ||
          error?.message?.includes('Unique constraint')
        ) {
          attempt++;
          if (attempt >= maxRetries) throw error;
          // Add a random delay (jitter) to avoid retry storms
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 300 + 100),
          );
          continue;
        }
        throw error;
      }
    }
  }

  async checkArrivalStatus(vendorId: number): Promise<ArrivalCheckResponseDto> {
    const dateNow = new Date();
    const operationalDate = getOperationalDate(dateNow);

    const bufferConfig = await this.systemConfigService.findByConfigKey(
      'ARRIVAL_BUFFER_MINUTES',
    );
    const bufferMinutes = bufferConfig
      ? parseInt(bufferConfig.config_value)
      : 30;

    const slot = await this.prisma.ops_delivery_slot.findFirst({
      where: {
        schedule: {
          vendor_id: vendorId,
        },
        expected_date: operationalDate,
        status: 'Open',
      },
      include: {
        schedule: true,
      },
      orderBy: {
        schedule: {
          arrival_time: 'asc',
        },
      },
    });

    const actualTimeStr = dateNow.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
    }).substring(0, 5);

    if (!slot) {
      return {
        arrival_status: 'Unscheduled',
        actual_time: actualTimeStr,
        slot_id: null,
      };
    }

    const plannedArrivalStr = slot.schedule.arrival_time; // HH:mm
    const plannedDate = getPlannedDateTime(operationalDate, plannedArrivalStr);

    const diffMs = dateNow.getTime() - plannedDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    let status: 'On-Time' | 'Late' | 'Early' = 'On-Time';
    if (diffMinutes > bufferMinutes) {
      status = 'Late';
    } else if (diffMinutes < -bufferMinutes) {
      status = 'Early';
    }

    return {
      arrival_status: status,
      planned_arrival_time: plannedArrivalStr,
      actual_time: actualTimeStr,
      slot_id: slot.slot_id,
    };
  }

  async checkDepartureStatus(queueNumber: string) {
    const dateNow = new Date();

    const bufferConfig = await this.systemConfigService.findByConfigKey(
      'ARRIVAL_BUFFER_MINUTES', // Fallback to Arrival Buffer if Departure buffer doesn't exist
    );
    const bufferMinutes = bufferConfig
      ? parseInt(bufferConfig.config_value)
      : 30;

    const entry = await this.prisma.ops_checkin_entry.findUnique({
      where: { queue_number: queueNumber },
      include: {
        delivery_slot: {
          include: {
            schedule: true,
          },
        },
      },
    });

    if (!entry) {
      throw new BadRequestException('Nomor antrean tidak ditemukan');
    }

    const actualTimeStr = dateNow.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
    }).substring(0, 5);

    if (!entry.delivery_slot) {
      return {
        departure_status: 'On-Time',
        actual_time: actualTimeStr,
        planned_departure_time: null,
      };
    }

    const plannedDepartureStr = entry.delivery_slot.schedule.departure_time; // HH:mm
    const plannedDate = getPlannedDateTime(entry.delivery_slot.expected_date, plannedDepartureStr);

    const diffMs = dateNow.getTime() - plannedDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    let status: 'On-Time' | 'Overdue' = 'On-Time';
    if (diffMinutes > bufferMinutes) {
      status = 'Overdue';
    }

    return {
      departure_status: status,
      planned_departure_time: plannedDepartureStr,
      actual_time: actualTimeStr,
    };
  }

  findAll() {
    return `This action returns all checkIn`;
  }

  findByQueue(queueNumber: string) {
    return this.prisma.ops_checkin_entry.findUnique({
      where: {
        queue_number: queueNumber,
      },
      select: {
        queue_number: true,
        current_status: true,
        snapshot_company_name: true,
        driver_name: true,
        submission_time: true,
        ops_queue_status: {
          select: {
            status_display_text: true,
            estimated_wait_minutes: true,
          },
        },
      },
    });
  }

  async findActiveQueue(
    query: PaginatedParamsDto,
  ): Promise<PaginatedResponse<DisplayQueue>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const dateNow = getStartOfToday();

    // Get display priority mode from config
    const priorityModeConfig = await this.systemConfigService.findByConfigKey(
      'DISPLAY_PRIORITY_MODE',
    );
    const priorityMode = priorityModeConfig?.config_value || 'STANDARD';

    // Determine orderBy based on priority mode
    let orderBy: any;
    if (priorityMode === 'PRIORITY') {
      // PRIORITY mode: non-compliant items first, then by priority_order
      orderBy = [
        { has_non_compliant_items: 'desc' as const },
        { ops_queue_status: { priority_order: 'asc' as const } },
      ];
    } else {
      // STANDARD mode: order by priority_order (FIFO)
      orderBy = {
        ops_queue_status: {
          priority_order: 'asc' as const,
        },
      };
    }

    const now = new Date();
    const opDate = getOperationalDate(now);
    const windowStart = getPlannedDateTime(opDate, '07:15');

    const [data, total] = await Promise.all([
      this.prisma.ops_checkin_entry.findMany({
        skip,
        take: limit,
        where: {
          current_status: {
            in: ['MENUNGGU', 'DISETUJUI', 'TERTAHAN', 'AKTIF'],
          },
          submission_time: {
            gte: windowStart,
          },
        },
        select: {
          queue_number: true,
          current_status: true,
          driver_name: true,
          snapshot_company_name: true,
          has_non_compliant_items: true,
          non_compliant_count: true,
          mst_vendor: {
            select: {
              vendor_code: true,
            },
          },
          ops_queue_status: {
            select: {
              priority_order: true,
              estimated_wait_minutes: true,
              status_display_text: true,
            },
          },
        },
        orderBy,
      }),
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: windowStart,
          },
        },
      }),
    ]);

    return {
      data: data.map((item: any) => ({
        ...item,
        vendor_code: item.mst_vendor?.vendor_code,
        mst_vendor: undefined,
      })),
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findUnscheduledMonitor() {
    const now = new Date();
    const opDate = getOperationalDate(now);
    const windowStart = getPlannedDateTime(opDate, '07:15');
    const windowEnd = new Date(windowStart.getTime() + 24 * 60 * 60 * 1000 - 1);

    return this.prisma.ops_checkin_entry.findMany({
      where: {
        arrival_status: 'Unscheduled',
        submission_time: {
          gte: windowStart,
          lte: windowEnd,
        },
      },
      select: {
        entry_id: true,
        queue_number: true,
        driver_name: true,
        snapshot_company_name: true,
        submission_time: true,
        current_status: true,
      },
      orderBy: { submission_time: 'desc' },
    });
  }

  async findVerificationList(
    query: PaginatedParamsDto,
  ): Promise<PaginatedResponse<VerificationList>> {
    const { page, limit, search, filter } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        { queue_number: { contains: search } },
        { driver_name: { contains: search } },
        { snapshot_company_name: { contains: search } },
        { snapshot_category_name: { contains: search } },
      ];
    }

    if (filter) {
      if (filter.start_date || filter.end_date) {
        where.submission_time = {};

        if (filter.start_date) {
          where.submission_time.gte = new Date(
            `${filter.start_date}T00:00:00.000Z`,
          );
        }

        if (filter.end_date) {
          const end = new Date(`${filter.end_date}T23:59:59.999Z`);
          where.submission_time.lte = end;
        }
      }

      if (filter.snapshot_vendor_category_id) {
        where.snapshot_vendor_category_id = Number(
          filter.snapshot_vendor_category_id,
        );
      }

      if (filter.status) {
        if (typeof filter.status === 'string' && filter.status.includes(',')) {
          where.current_status = { in: filter.status.split(',') as QueueStatus[] };
        } else {
          where.current_status = filter.status;
        }
      }
    }

    // Get display priority mode from config
    const priorityModeConfig = await this.systemConfigService.findByConfigKey(
      'DISPLAY_PRIORITY_MODE',
    );
    const priorityMode = priorityModeConfig?.config_value || 'STANDARD';

    // Determine orderBy based on priority mode
    let orderBy: any;
    if (priorityMode === 'PRIORITY') {
      // PRIORITY mode: non-compliant items first, then by submission time
      orderBy = [
        { has_non_compliant_items: 'desc' as const },
        { submission_time: 'asc' as const },
      ];
    } else {
      // STANDARD mode: order by submission time (FIFO)
      orderBy = {
        submission_time: 'asc' as const,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.ops_checkin_entry.findMany({
        skip,
        take: limit,
        select: {
          queue_number: true,
          driver_name: true,
          submission_time: true,
          snapshot_company_name: true,
          snapshot_category_name: true,
          current_status: true,
          has_non_compliant_items: true,
          non_compliant_count: true,
          dn_number: true,
          po_number: true,
          arrival_status: true,
          ai_safety_status: true,
          ops_timelog: {
            select: {
              departure_status: true,
            },
          },
        },
        where,
        orderBy,
      }),
      this.prisma.ops_checkin_entry.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findVerificationListById(queueNumber: string) {
    const entry = await this.prisma.ops_checkin_entry.findUnique({
      where: {
        queue_number: queueNumber,
      },
      select: {
        queue_number: true,
        driver_name: true,
        submission_time: true,
        snapshot_company_name: true,
        snapshot_category_name: true,
        dn_number: true,
        po_number: true,
        arrival_status: true,
        ai_safety_status: true,
        current_status: true,
        has_non_compliant_items: true,
        non_compliant_count: true,
        ops_timelog: {
          select: {
            checkin_time: true,
            checkout_time: true,
            duration_minutes: true,
            is_checked_out: true,
            departure_status: true,
            delay_departure_reason_id: true,
            user: {
              select: {
                full_name: true,
              },
            },
          },
        },
        ops_ppe_scan: {
          select: {
            is_compliant: true,
            has_hardhat: true,
            has_safety_vest: true,
            image_path: true,
          },
        },
        ops_officer_discrepancy: {
          select: {
            discrepancy_id: true,
            response_id: true,
            item_text_snapshot: true,
            officer_note: true,
            evidence_image_path: true,
            created_at: true,
            user: {
              select: {
                full_name: true,
              },
            },
          },
        },
        ops_verification: {
          select: {
            verification_status: true,
            rejection_reason: true,
            verification_time: true,
            user: {
              select: {
                full_name: true,
              },
            },
          },
        },
        ops_checkin_response: {
          select: {
            response_id: true,
            item_text_snapshot: true,
            response_value: true,
            is_compliant: true,
            display_order: true,
            item_type: true,
            checklist_item: {
              select: {
                vendor_category_id: true,
                vendor_category: {
                  select: {
                    category_name: true,
                  },
                },
              },
            },
            checklist_category: {
              select: {
                category_name: true,
                display_order: true,
                icon_name: true,
                color_code: true,
              },
            },
          },
          orderBy: {
            display_order: 'asc',
          },
        },
      },
    });

    if (!entry) return null;

    const checklist_responses = this.formatCheckinResponses(
      entry.ops_checkin_response,
      entry.ops_officer_discrepancy
    );

    const { ops_checkin_response, ...rest } = entry;
    return {
      ...rest,
      checklist_responses,
      officer_discrepancies: entry.ops_officer_discrepancy,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} checkIn`;
  }

  update(id: number, updateCheckInDto: UpdateCheckInDto) {
    return `This action updates a #${id} checkIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkIn`;
  }

  async verifyCheckIn(
    verifyCheckInDto: VerifyCheckInDto,
    requestInfo: any,
    userId: number,
  ) {
    const { queue_number, action, rejection_reason } = verifyCheckInDto;
    const localUserId = await this.resolveLocalUser(userId);

    // Validate rejection_reason is required for REJECT action
    if (action === 'REJECT' && !rejection_reason?.trim()) {
      throw new BadRequestException(
        'Alasan penolakan harus diisi untuk aksi REJECT',
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Find and validate entry
      const entry = await tx.ops_checkin_entry.findUnique({
        where: { queue_number },
        select: {
          entry_id: true,
          current_status: true,
          driver_name: true,
          snapshot_company_name: true,
        },
      });

      if (!entry) {
        throw new BadRequestException('Nomor antrean tidak ditemukan');
      }

      if (entry.current_status !== QueueStatus.MENUNGGU) {
        throw new BadRequestException(
          `Check-in sudah diverifikasi dengan status: ${entry.current_status}`,
        );
      }

      // 2. Determine new status
      const newStatus =
        action === 'APPROVE' ? QueueStatus.DISETUJUI : QueueStatus.DITOLAK;

      // 3. Get display text from config
      const statusConfigKey =
        action === 'APPROVE'
          ? 'DEFAULT_STATUS_DISETUJUI_DISPLAY_TEXT'
          : 'DEFAULT_STATUS_DITOLAK_DISPLAY_TEXT';

      const statusDisplayText =
        await this.systemConfigService.findByConfigKey(statusConfigKey);

      // 4. Update ops_checkin_entry
      await tx.ops_checkin_entry.update({
        where: { queue_number },
        data: {
          current_status: newStatus,
          updated_at: new Date(),
        },
      });

      // 5. Update ops_queue_status
      await tx.ops_queue_status.update({
        where: { entry_id: entry.entry_id },
        data: {
          current_status: newStatus,
          status_display_text: statusDisplayText.config_value,
          last_updated: new Date(),
        },
      });

      // 6. Create ops_verification record
      await tx.ops_verification.create({
        data: {
          entry_id: entry.entry_id,
          verified_by_user_id: localUserId,
          verification_status: newStatus,
          rejection_reason: action === 'REJECT' ? rejection_reason : null,
          verification_time: new Date(),
        },
      });

      // Audit log moved to interceptor

      // 8. Return result
      return {
        entry_id: entry.entry_id, // For Audit Log
        user_id: localUserId, // For Audit Log
        queue_number,
        status: newStatus,
        status_display_text: statusDisplayText.config_value,
        driver_name: entry.driver_name,
        company_name: entry.snapshot_company_name,
        verified_at: new Date(),
      };
    });
  }

  async checkoutEntry(
    checkoutDto: CheckoutCheckInDto,
    requestInfo: any,
    userId: number,
  ) {
    const { queue_number } = checkoutDto;
    const localUserId = await this.resolveLocalUser(userId);

    const verificationModeConfig =
      await this.systemConfigService.findByConfigKey(
        'VERIFICATION_MODE_ENABLED',
      );
    const isVerificationEnabled =
      verificationModeConfig?.config_value === 'true';

    return await this.prisma.$transaction(async (tx) => {
      // 1. Find and validate entry
      const entry = await tx.ops_checkin_entry.findUnique({
        where: { queue_number },
        select: {
          entry_id: true,
          current_status: true,
          driver_name: true,
          snapshot_company_name: true,
          ops_timelog: {
            select: {
              timelog_id: true,
              checkin_time: true,
              is_checked_out: true,
            },
          },
        },
      });

      if (!entry) {
        throw new BadRequestException('Nomor antrean tidak ditemukan');
      }

      if (
        entry.current_status !== QueueStatus.DISETUJUI &&
        entry.current_status !== QueueStatus.AKTIF
      ) {
        throw new BadRequestException(
          `Checkout hanya dapat dilakukan untuk status DISETUJUI atau AKTIF. Status saat ini: ${entry.current_status}`,
        );
      }

      if (!entry.ops_timelog) {
        throw new BadRequestException('Data timelog tidak ditemukan');
      }

      if (entry.ops_timelog.is_checked_out) {
        throw new BadRequestException('Antrean sudah melakukan checkout');
      }

      // 2. Calculate duration
      const checkoutTime = new Date();
      const checkinTime = entry.ops_timelog.checkin_time;
      let durationMinutes: number | null = null;

      if (checkinTime) {
        const diffMs = checkoutTime.getTime() - checkinTime.getTime();
        durationMinutes = Math.round(diffMs / 60000);
      }

      // 3. Get display text from config
      const statusDisplayText = await this.systemConfigService.findByConfigKey(
        'DEFAULT_STATUS_SELESAI_DISPLAY_TEXT',
      );

      // 4. Update ops_timelog
      await tx.ops_timelog.update({
        where: { timelog_id: entry.ops_timelog.timelog_id },
        data: {
          checkout_time: checkoutTime,
          checkout_by_user_id: localUserId,
          is_checked_out: true,
          duration_minutes: durationMinutes,
          departure_status: checkoutDto.departure_status,
          delay_departure_reason_id: checkoutDto.delay_departure_reason_id,
          updated_at: checkoutTime,
        },
      });

      // 5. Update ops_checkin_entry
      await tx.ops_checkin_entry.update({
        where: { queue_number },
        data: {
          current_status: QueueStatus.SELESAI,
          updated_at: checkoutTime,
        },
      });

      // 6. Update ops_queue_status
      await tx.ops_queue_status.update({
        where: { entry_id: entry.entry_id },
        data: {
          current_status: QueueStatus.SELESAI,
          status_display_text: statusDisplayText.config_value,
          last_updated: checkoutTime,
        },
      });

      // Audit log moved to interceptor

      // 8. Return result
      return {
        entry_id: entry.entry_id,
        user_id: localUserId,
        queue_number,
        previous_status: entry.current_status,
        status: QueueStatus.SELESAI,
        status_display_text: statusDisplayText.config_value,
        driver_name: entry.driver_name,
        company_name: entry.snapshot_company_name,
        checkout_time: checkoutTime,
        duration_minutes: durationMinutes,
      };
    });
  }

  async processAiSafety(queueNumber: string, aiSafetyDto: any) {
    // Basic mock: we simulate an AI Safety verification.
    // In real implementation, this would send `aiSafetyDto.image_base64` to vitara-ai model API.
    const mockIsSafe = true; // Hardcoded mock
    const newStatus = mockIsSafe ? 'Pass' : 'Fail';

    const entry = await this.prisma.ops_checkin_entry.update({
      where: { queue_number: queueNumber },
      data: { ai_safety_status: newStatus },
      select: {
        queue_number: true,
        ai_safety_status: true,
      },
    });

    return entry;
  }

  async holdEntry(holdDto: HoldCheckInDto, requestInfo: any, userId: number) {
    const { queue_number, reason } = holdDto;
    const localUserId = await this.resolveLocalUser(userId);

    return await this.prisma.$transaction(async (tx) => {
      const entry = await tx.ops_checkin_entry.findUnique({
        where: { queue_number },
        select: {
          entry_id: true,
          current_status: true,
          driver_name: true,
          snapshot_company_name: true,
        },
      });

      if (!entry) {
        throw new BadRequestException('Nomor antrean tidak ditemukan');
      }

      if (entry.current_status !== QueueStatus.DISETUJUI) {
        throw new BadRequestException(
          `Hanya antrean dengan status DISETUJUI yang dapat ditahan. Status saat ini: ${entry.current_status}`,
        );
      }

      const statusDisplayText = await this.systemConfigService.findByConfigKey(
        'DEFAULT_STATUS_TERTAHAN_DISPLAY_TEXT',
      );

      const updateTime = new Date();

      await tx.ops_checkin_entry.update({
        where: { queue_number },
        data: {
          current_status: QueueStatus.TERTAHAN,
          updated_at: updateTime,
        },
      });

      await tx.ops_queue_status.update({
        where: { entry_id: entry.entry_id },
        data: {
          current_status: QueueStatus.TERTAHAN,
          status_display_text: statusDisplayText?.config_value || 'Tertahan',
          last_updated: updateTime,
        },
      });

      // Update existing verification record or create if not exist
      await tx.ops_verification.upsert({
        where: { entry_id: entry.entry_id },
        create: {
          entry_id: entry.entry_id,
          verified_by_user_id: localUserId,
          verification_status: QueueStatus.TERTAHAN,
          rejection_reason: reason,
          verification_time: updateTime,
        },
        update: {
          verified_by_user_id: localUserId,
          verification_status: QueueStatus.TERTAHAN,
          rejection_reason: reason,
          verification_time: updateTime,
        },
      });

      return {
        entry_id: entry.entry_id,
        user_id: localUserId,
        queue_number,
        status: QueueStatus.TERTAHAN,
        status_display_text: statusDisplayText?.config_value || 'Tertahan',
        driver_name: entry.driver_name,
        company_name: entry.snapshot_company_name,
        hold_time: updateTime,
        reason,
      };
    });
  }

  async resumeEntry(
    resumeDto: ResumeCheckInDto,
    requestInfo: any,
    userId: number,
  ) {
    const { queue_number } = resumeDto;
    const localUserId = await this.resolveLocalUser(userId);

    return await this.prisma.$transaction(async (tx) => {
      const entry = await tx.ops_checkin_entry.findUnique({
        where: { queue_number },
        select: {
          entry_id: true,
          current_status: true,
          driver_name: true,
          snapshot_company_name: true,
        },
      });

      if (!entry) {
        throw new BadRequestException('Nomor antrean tidak ditemukan');
      }

      if (entry.current_status !== QueueStatus.TERTAHAN) {
        throw new BadRequestException(
          `Hanya antrean dengan status TERTAHAN yang dapat dilanjutkan. Status saat ini: ${entry.current_status}`,
        );
      }

      const statusDisplayText = await this.systemConfigService.findByConfigKey(
        'DEFAULT_STATUS_DISETUJUI_DISPLAY_TEXT',
      );

      const updateTime = new Date();

      await tx.ops_checkin_entry.update({
        where: { queue_number },
        data: {
          current_status: QueueStatus.DISETUJUI,
          updated_at: updateTime,
        },
      });

      await tx.ops_queue_status.update({
        where: { entry_id: entry.entry_id },
        data: {
          current_status: QueueStatus.DISETUJUI,
          status_display_text:
            statusDisplayText?.config_value || 'Sedang Diproses',
          last_updated: updateTime,
        },
      });

      // Update the verification record back to DISETUJUI
      await tx.ops_verification.update({
        where: { entry_id: entry.entry_id },
        data: {
          verified_by_user_id: localUserId,
          verification_status: QueueStatus.DISETUJUI,
          rejection_reason: null, // Clear the hold reason
          verification_time: updateTime,
        },
      });

      return {
        entry_id: entry.entry_id,
        user_id: localUserId,
        queue_number,
        status: QueueStatus.DISETUJUI,
        status_display_text:
          statusDisplayText?.config_value || 'Sedang Diproses',
        driver_name: entry.driver_name,
        company_name: entry.snapshot_company_name,
        resume_time: updateTime,
      };
    });
  }

  async submitDiscrepancy(
    submitDiscrepancyDto: SubmitDiscrepancyDto,
    userId: number,
  ) {
    const { queue_number, discrepancies } = submitDiscrepancyDto;
    const localUserId = await this.resolveLocalUser(userId);

    const entry = await this.prisma.ops_checkin_entry.findUnique({
      where: { queue_number },
      select: {
        entry_id: true,
        current_status: true,
      },
    });

    if (!entry) {
      throw new BadRequestException('Nomor antrean tidak ditemukan');
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Delete existing discrepancies for this entry if any (to support re-submission/update)
      await tx.ops_officer_discrepancy.deleteMany({
        where: { entry_id: entry.entry_id },
      });

      // 2. Create new discrepancies
      if (discrepancies.length > 0) {
        await tx.ops_officer_discrepancy.createMany({
          data: discrepancies.map((d) => ({
            entry_id: entry.entry_id,
            response_id: d.response_id,
            item_text_snapshot: d.item_text_snapshot,
            officer_note: d.officer_note,
            evidence_image_path: d.evidence_image_path,
            marked_by_user_id: localUserId,
          })),
        });
      }

      // 3. Re-calculate entry compliance status
      // An entry is non-compliant if:
      // - Vendor self-report has non-compliant items
      // - PPE scan is non-compliant
      // - Officer found additional discrepancies
      const vendorNonCompliantCount = await tx.ops_checkin_response.count({
        where: { entry_id: entry.entry_id, is_compliant: false },
      });

      const ppeNonCompliantCount = await tx.ops_ppe_scan.count({
        where: { entry_id: entry.entry_id, is_compliant: false },
      });

      const totalNonCompliantCount =
        vendorNonCompliantCount + ppeNonCompliantCount + discrepancies.length;

      const isActuallyNonCompliant = totalNonCompliantCount > 0;

      await tx.ops_checkin_entry.update({
        where: { entry_id: entry.entry_id },
        data: {
          has_non_compliant_items: isActuallyNonCompliant,
          non_compliant_count: totalNonCompliantCount,
          updated_at: new Date(),
        },
      });

      return {
        entry_id: entry.entry_id,
        user_id: localUserId,
        queue_number,
        count: discrepancies.length,
      };
    });
  }

  private async resolveLocalUser(tokenUserId: number): Promise<number> {
    // 1. Try to find by user_id (if token ID matches local ID)
    const userById = await this.prisma.mst_user.findUnique({
      where: { user_id: tokenUserId },
    });
    if (userById) return userById.user_id;

    // 2. Try to find by external_user_id (if token ID is external ID)
    const userByExternal = await this.prisma.mst_user.findUnique({
      where: { external_user_id: tokenUserId },
    });
    if (userByExternal) return userByExternal.user_id;

    throw new BadRequestException('User tidak ditemukan dalam database lokal');
  }

  private async validateVendor(vendor_id: number) {
    const vendor = await this.vendorService.findOne(vendor_id);
    if (!vendor) {
      throw new BadRequestException('Vendor tidak ditemukan');
    }
    return vendor;
  }

  private formatCheckinResponses(responses: any[], discrepancies: any[] = []) {
    const grouped = responses.reduce((acc, response) => {
      const categoryName = response.checklist_category.category_name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category_name: categoryName,
          display_order: response.checklist_category.display_order,
          icon_name: response.checklist_category.icon_name,
          color_code: response.checklist_category.color_code,
          items: [],
        };
      }

      // Find if this response has a discrepancy from the officer
      const discrepancy = discrepancies.find(d => d.response_id === response.response_id);

      acc[categoryName].items.push({
        response_id: response.response_id,
        item_type: response.item_type,
        item_text_snapshot: response.item_text_snapshot,
        response_value: response.response_value,
        is_compliant: response.is_compliant,
        display_order: response.display_order,
        vendor_category_name:
          response.checklist_item?.vendor_category?.category_name,
        vendor_category_id: response.checklist_item?.vendor_category_id,
        officer_discrepancy: discrepancy ? {
          officer_note: discrepancy.officer_note,
          evidence_image_path: discrepancy.evidence_image_path,
          officer_name: discrepancy.user?.full_name
        } : null
      });
      return acc;
    }, {});

    return Object.values(grouped)
      .map((category: any) => {
        category.items.sort((a: any, b: any) => {
          const typeA = a.item_type?.toLowerCase();
          const typeB = b.item_type?.toLowerCase();

          // Primary sort: item_type ('umum' first, 'khusus' last)
          if (typeA === 'umum' && typeB !== 'umum') {
            return -1;
          }
          if (typeA !== 'umum' && typeB === 'umum') {
            return 1;
          }

          // Secondary sort: vendor_category_id / name
          const matA = a.vendor_category_id || 0;
          const matB = b.vendor_category_id || 0;

          if (matA !== matB) {
            return matA - matB;
          }

          // Tertiary sort: display_order
          return a.display_order - b.display_order;
        });
        return category;
      })
      .sort((a: any, b: any) => a.display_order - b.display_order);
  }

  private async validateVendorCategory(vendor_category_id: number | undefined) {
    if (!vendor_category_id) return null;
    const vendorCategory =
      await this.vendorCategoryService.findOne(vendor_category_id);
    if (!vendorCategory) {
      throw new BadRequestException('Vendor Category tidak ditemukan');
    }
    return vendorCategory;
  }

  private async generateFormattedQueueNumber(tx: any) {
    const format =
      await this.systemConfigService.findByConfigKey('QUEUE_FORMAT');
    const now = new Date();
    const pad = (num: number, length: number) =>
      String(num).padStart(length, '0');
    const todayPrefix = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}`;

    const last = await tx.ops_checkin_entry.findFirst({
      where: {
        queue_number: {
          startsWith: todayPrefix,
        },
      },
      orderBy: {
        queue_number: 'desc',
      },
      select: {
        queue_number: true,
      },
    });

    const lastSeq = last ? extractSequence(last.queue_number) : 0;
    const nextSeq = lastSeq + 1;
    return generateQueueNumber(format.config_value, nextSeq);
  }

  private calculateCompliance(
    checklist_responses: any[],
    ppeIsNonCompliant = false,
  ) {
    const checklistNonCompliantCount = checklist_responses.filter(
      (item: any) => item.response_value === false,
    ).length;

    // PPE scan yang tidak compliant dihitung sebagai 1 non-compliant item tambahan
    const nonCompliantCount =
      checklistNonCompliantCount + (ppeIsNonCompliant ? 1 : 0);
    const hasNonCompliantItems = nonCompliantCount > 0;

    return { hasNonCompliantItems, nonCompliantCount };
  }

  private async processChecklistResponses(
    tx: any,
    entryId: number,
    checklist_responses: any[],
  ) {
    const checklistItemIds = checklist_responses.map(
      (item) => item.checklist_item_id,
    );

    const checklistItems =
      await this.checklistService.findManyByIds(checklistItemIds);

    const checklistItemMap = new Map(
      checklistItems.map((item) => [item.checklist_item_id, item]),
    );

    const responsesData = checklist_responses.map((item) => {
      const checklistItem = checklistItemMap.get(item.checklist_item_id);

      if (!checklistItem) {
        throw new BadRequestException(
          `Invalid checklist_item_id: ${item.checklist_item_id}`,
        );
      }

      return {
        entry_id: entryId,
        checklist_item_id: item.checklist_item_id,
        checklist_category_id: checklistItem.checklist_category_id,
        item_text_snapshot: checklistItem.item_text,
        item_type: checklistItem.item_type,
        response_value: item.response_value,
        is_compliant: item.response_value,
        display_order: checklistItem.display_order,
      };
    });

    await tx.ops_checkin_response.createMany({
      data: responsesData,
    });
  }

  private async createTimeLog(tx: any, entryId: number, date: Date) {
    await tx.ops_timelog.create({
      data: {
        entry_id: entryId,
        checkin_time: date,
        is_checked_out: false,
      },
    });
  }

  private async createQueueStatus(
    tx: any,
    entryId: number,
    queueNumber: string,
    date: Date,
    initialStatus: string,
  ) {
    const startOfToday = getStartOfToday();
    const lastPriority = await tx.ops_queue_status.findFirst({
      where: {
        last_updated: {
          gte: startOfToday,
        },
      },
      orderBy: [{ last_updated: 'desc' }, { queue_status_id: 'desc' }],
      select: {
        priority_order: true,
      },
    });

    const lastPrioritySeq = lastPriority ? lastPriority.priority_order : 0;
    const nextPriority = lastPrioritySeq + 1;

    const estimatedWaitMinutes = await this.systemConfigService.findByConfigKey(
      'ESTIMATED_WAIT_MINUTES',
    );
    const statusDisplayTextKey =
      initialStatus === QueueStatus.AKTIF
        ? 'DEFAULT_STATUS_DISETUJUI_DISPLAY_TEXT'
        : 'DEFAULT_STATUS_MENUNGGU_DISPLAY_TEXT';

    const statusDisplayText =
      await this.systemConfigService.findByConfigKey(statusDisplayTextKey);

    await tx.ops_queue_status.create({
      data: {
        entry_id: entryId,
        queue_number: queueNumber,
        current_status: initialStatus,
        status_display_text: statusDisplayText.config_value,
        priority_order: nextPriority,
        estimated_wait_minutes: toInt(estimatedWaitMinutes.config_value),
        last_updated: date,
      },
    });
  }

  private async createPpeScan(
    tx: any,
    entryId: number,
    dto: CreateCheckInDto,
    scanTime: Date,
  ) {
    await tx.ops_ppe_scan.create({
      data: {
        entry_id: entryId,
        has_hardhat: dto.ppe_has_hardhat ?? false,
        has_safety_vest: dto.ppe_has_safety_vest ?? false,
        is_compliant: dto.ai_safety_status === 'Pass',
        image_path: dto.ppe_image_path ?? null,
        scan_time: scanTime,
      },
    });
  }
}
