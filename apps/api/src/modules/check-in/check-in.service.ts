import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { VerifyCheckInDto } from './dto/verify-check-in.dto';
import { CheckoutCheckInDto } from './dto/checkout-check-in.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VendorService } from '../vendor/vendor.service';
import { generateQueueNumber } from 'src/common/utils/queue-number.util.';
import { SystemConfigService } from '../system-config/system-config.service';
import { extractSequence } from 'src/common/utils/extract-sequence.util';
import { ChecklistService } from '../checklist/checklist.service';
import { getStartOfToday } from 'src/common/utils/today-date.util';

// Removed TimeLogService import

import { toInt } from 'src/common/utils/string-to-int.util';
import { MaterialCategoryService } from '../material_category/material_category.service';
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

    private readonly materialCategoryService: MaterialCategoryService,
  ) {}

  async create(createCheckInDto: CreateCheckInDto, requestInfo: any) {
    const maxRetries = 3;
    let attempt = 0;
    const dateNow = new Date();

    while (attempt < maxRetries) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          // 1. Validate
          const vendor = await this.validateVendor(createCheckInDto.vendor_id);
          const materialCategory = await this.validateMaterialCategory(
            createCheckInDto.material_category_id,
          );

          // 2. Generate Queue Number
          const queueNumber = await this.generateFormattedQueueNumber(tx);

          // 3. Compliance Check
          const { hasNonCompliantItems, nonCompliantCount } =
            this.calculateCompliance(createCheckInDto.checklist_responses);

          // 4. Create CheckIn Entry
          const checkIn = await tx.ops_checkin_entry.create({
            data: {
              queue_number: queueNumber,
              vendor_id: createCheckInDto.vendor_id,
              driver_name: createCheckInDto.driver_name,
              material_category_id: createCheckInDto.material_category_id,
              snapshot_company_name: vendor.company_name,
              snapshot_category_name: materialCategory.category_name,
              submission_time: dateNow,
              current_status: 'MENUNGGU',
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
          await this.createQueueStatus(tx, checkIn.entry_id, queueNumber);

          // 7. Create Time Log
          await this.createTimeLog(tx, checkIn.entry_id);

          // Audit log moved to interceptor

          const estimatedWaitMinutes =
            await this.systemConfigService.findByConfigKey(
              'ESTIMATED_WAIT_MINUTES',
            );
          const statusDisplayText =
            await this.systemConfigService.findByConfigKey(
              'DEFAULT_STATUS_MENUNGGU_DISPLAY_TEXT',
            );

          // 9. Return Result
          return {
            entry_id: checkIn.entry_id, // For Audit Log
            queue_number: queueNumber,
            company_name: vendor.company_name,
            driver_name: createCheckInDto.driver_name,
            status_display_text: statusDisplayText.config_value,
            estimated_wait_minutes: toInt(estimatedWaitMinutes.config_value),
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
          continue;
        }
        throw error;
      }
    }
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

    const [data, total] = await Promise.all([
      this.prisma.ops_checkin_entry.findMany({
        skip,
        take: limit,
        where: {
          current_status: {
            in: ['MENUNGGU', 'DISETUJUI'],
          },
          submission_time: {
            gte: dateNow,
          },
        },
        select: {
          queue_number: true,
          current_status: true,
          driver_name: true,
          snapshot_company_name: true,
          ops_queue_status: {
            select: {
              priority_order: true,
              estimated_wait_minutes: true,
            },
          },
        },
        orderBy: {
          ops_queue_status: {
            priority_order: 'asc',
          },
        },
      }),
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: dateNow,
          },
        },
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

      if (filter.material_category_id) {
        where.material_category_id = Number(filter.material_category_id);
      }

      if (filter.status) {
        where.current_status = filter.status;
      }
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
        },
        where,
        orderBy: {
          submission_time: 'asc',
        },
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
        ops_timelog: {
          select: {
            checkin_time: true,
            checkout_time: true,
            duration_minutes: true,
            is_checked_out: true,
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
            item_text_snapshot: true,
            response_value: true,
            is_compliant: true,
            display_order: true,
            item_type: true,
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
    );

    const { ops_checkin_response, ...rest } = entry;
    return {
      ...rest,
      checklist_responses,
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

      if (entry.current_status !== QueueStatus.DISETUJUI) {
        throw new BadRequestException(
          `Checkout hanya dapat dilakukan untuk status DISETUJUI. Status saat ini: ${entry.current_status}`,
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
        status: QueueStatus.SELESAI,
        status_display_text: statusDisplayText.config_value,
        driver_name: entry.driver_name,
        company_name: entry.snapshot_company_name,
        checkout_time: checkoutTime,
        duration_minutes: durationMinutes,
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

  private formatCheckinResponses(responses: any[]) {
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
      acc[categoryName].items.push({
        item_type: response.item_type,
        item_text_snapshot: response.item_text_snapshot,
        response_value: response.response_value,
        is_compliant: response.is_compliant,
        display_order: response.display_order,
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

          // Secondary sort: display_order
          return a.display_order - b.display_order;
        });
        return category;
      })
      .sort((a: any, b: any) => a.display_order - b.display_order);
  }

  private async validateMaterialCategory(material_category_id: number) {
    const materialCategory =
      await this.materialCategoryService.findOne(material_category_id);
    if (!materialCategory) {
      throw new BadRequestException('Material Category tidak ditemukan');
    }
    return materialCategory;
  }

  private async generateFormattedQueueNumber(tx: any) {
    const format =
      await this.systemConfigService.findByConfigKey('QUEUE_FORMAT');
    const startOfToday = getStartOfToday();

    const last = await tx.ops_checkin_entry.findFirst({
      where: {
        submission_time: {
          gte: startOfToday,
        },
      },
      orderBy: {
        submission_time: 'desc',
      },
      select: {
        queue_number: true,
      },
    });

    const lastSeq = last ? extractSequence(last.queue_number) : 0;
    const nextSeq = lastSeq + 1;
    return generateQueueNumber(format.config_value, nextSeq);
  }

  private calculateCompliance(checklist_responses: any[]) {
    const hasNonCompliantItems = checklist_responses.some(
      (item: any) => item.response_value === false,
    );
    const nonCompliantCount = checklist_responses.filter(
      (item: any) => item.response_value === false,
    ).length;

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

  private async createTimeLog(tx: any, entryId: number) {
    await tx.ops_timelog.create({
      data: {
        entry_id: entryId,
        checkin_time: new Date(),
        is_checked_out: false,
      },
    });
  }

  private async createQueueStatus(
    tx: any,
    entryId: number,
    queueNumber: string,
  ) {
    const startOfToday = getStartOfToday();
    const lastPriority = await tx.ops_queue_status.findFirst({
      where: {
        last_updated: {
          gte: startOfToday,
        },
      },
      orderBy: {
        last_updated: 'desc',
      },
      select: {
        priority_order: true,
      },
    });

    const lastPrioritySeq = lastPriority ? lastPriority.priority_order : 0;
    const nextPriority = lastPrioritySeq + 1;

    const estimatedWaitMinutes = await this.systemConfigService.findByConfigKey(
      'ESTIMATED_WAIT_MINUTES',
    );
    const statusDisplayText = await this.systemConfigService.findByConfigKey(
      'DEFAULT_STATUS_MENUNGGU_DISPLAY_TEXT',
    );

    await tx.ops_queue_status.create({
      data: {
        entry_id: entryId,
        queue_number: queueNumber,
        current_status: 'MENUNGGU',
        status_display_text: statusDisplayText.config_value,
        priority_order: nextPriority,
        estimated_wait_minutes: toInt(estimatedWaitMinutes.config_value),
      },
    });
  }
}
