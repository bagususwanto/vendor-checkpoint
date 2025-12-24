import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VendorService } from '../vendor/vendor.service';
import { generateQueueNumber } from 'src/common/utils/queue-number.util.';
import { SystemConfigService } from '../system-config/system-config.service';
import { extractSequence } from 'src/common/utils/extract-sequence.util';
import { ChecklistService } from '../checklist/checklist.service';
import { getStartOfToday } from 'src/common/utils/today-date.util';

// Removed TimeLogService import

import { AuditService } from '../audit/audit.service';
import { toInt } from 'src/common/utils/string-to-int.util';
import { MaterialCategoryService } from '../material_category/material_category.service';

@Injectable()
export class CheckInService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorService,
    private readonly systemConfigService: SystemConfigService,
    private readonly checklistService: ChecklistService,
    private readonly auditService: AuditService,
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

          // 8. Create Audit Log
          await this.auditService.create(tx, {
            entry_id: checkIn.entry_id,
            action_type: 'CHECKIN_CREATE',
            action_description: 'Check-in entry created',
            ip_address: requestInfo.ipAddress,
            user_agent: requestInfo.userAgent,
            new_value: JSON.stringify({
              queue_number: queueNumber,
              vendor_id: createCheckInDto.vendor_id,
              driver_name: createCheckInDto.driver_name,
            }),
          });

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

  findOne(id: number) {
    return `This action returns a #${id} checkIn`;
  }

  update(id: number, updateCheckInDto: UpdateCheckInDto) {
    return `This action updates a #${id} checkIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkIn`;
  }

  private async validateVendor(vendor_id: number) {
    const vendor = await this.vendorService.findOne(vendor_id);
    if (!vendor) {
      throw new BadRequestException('Vendor tidak ditemukan');
    }
    return vendor;
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
