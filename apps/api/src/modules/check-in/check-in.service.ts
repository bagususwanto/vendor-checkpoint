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

@Injectable()
export class CheckInService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorService,
    private readonly systemConfigService: SystemConfigService,
    private readonly checklistService: ChecklistService,


    private readonly auditService: AuditService,
  ) {}

  async create(createCheckInDto: CreateCheckInDto, requestInfo: any) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          // 1. Validate Vendor
          const vendor = await this.validateVendor(createCheckInDto.vendor_id);

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
              snapshot_vendor_category_id: vendor.vendor_category_id,
              snapshot_company_name: vendor.company_name,
              snapshot_category_name: vendor.vendor_category.category_name,
              submission_time: new Date(),
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

          // 9. Return Result
          return {
            queue_number: queueNumber,
            company_name: vendor.company_name,
            driver_name: createCheckInDto.driver_name,
            current_status: 'MENUNGGU',
            submission_time: new Date(),
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

  private async createQueueStatus(tx: any, entryId: number, queueNumber: string) {
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

    await tx.ops_queue_status.create({
      data: {
        entry_id: entryId,
        queue_number: queueNumber,
        current_status: 'MENUNGGU',
        status_display_text: 'Menunggu Verifikasi',
        priority_order: nextPriority,
      },
    });
  }
}
