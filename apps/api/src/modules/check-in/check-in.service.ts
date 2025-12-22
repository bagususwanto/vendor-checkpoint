import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VendorService } from '../vendor/vendor.service';
import { generateQueueNumber } from 'src/common/utils/queue-number.util.';
import { SystemConfigService } from '../system-config/system-config.service';
import { extractSequence } from 'src/common/utils/extract-sequence.util';
import { ChecklistService } from '../checklist/checklist.service';
import { queue } from 'rxjs';

@Injectable()
export class CheckInService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorService,
    private readonly systemConfigService: SystemConfigService,
    private readonly checklistService: ChecklistService,
  ) {}

  private findLastQueueNumberToday() {
    return this.prisma.ops_checkin_entry.findFirst({
      where: {
        submission_time: {
          gte: new Date(),
        },
      },
      orderBy: {
        submission_time: 'desc',
      },
      select: {
        queue_number: true,
      },
    });
  }

  private findLastPriorityToday() {
    return this.prisma.ops_queue_status.findFirst({
      where: {
        last_updated: {
          gte: new Date(),
        },
      },
      orderBy: {
        last_updated: 'desc',
      },
      select: {
        priority_order: true,
      },
    });
  }

  async create(createCheckInDto: CreateCheckInDto, requestInfo) {
    return this.prisma.$transaction(async (tx) => {
      //  Validasi awal
      const vendor = await this.vendorService.findOne(
        createCheckInDto.vendor_id,
      );
      if (!vendor) {
        throw new BadRequestException('Vendor tidak ditemukan');
      }

      // queue number process
      const format =
        await this.systemConfigService.findByConfigKey('QUEUE_FORMAT');
      const last = await this.findLastQueueNumberToday();
      const lastSeq = last ? extractSequence(last.queue_number) : 0;
      const nextSeq = lastSeq + 1;
      const queueNumber = generateQueueNumber(format.config_value, nextSeq);

      // get request information
      const ipAddress = requestInfo.ipAddress;
      const deviceIdentifier = requestInfo.deviceIdentifier;

      // compliant check
      const hasNonCompliantItems = createCheckInDto.checklist_responses.some(
        (item: any) => item.response_value === false,
      );
      const nonCompliantCount = createCheckInDto.checklist_responses.filter(
        (item: any) => item.response_value === false,
      ).length;

      //  Insert check-in
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
          ip_address: ipAddress,
          device_identifier: deviceIdentifier,
          has_non_compliant_items: hasNonCompliantItems,
          non_compliant_count: nonCompliantCount,
        },
      });

      // 1. Ambil semua checklist_item_id
      const checklistItemIds = createCheckInDto.checklist_responses.map(
        (item) => item.checklist_item_id,
      );

      // 2. Ambil checklist item sekaligus
      const checklistItems =
        await this.checklistService.findManyByIds(checklistItemIds);

      // 3. Bikin map biar lookup O(1)
      const checklistItemMap = new Map(
        checklistItems.map((item) => [item.checklist_item_id, item]),
      );

      // 4. Build data untuk createMany
      const responsesData = createCheckInDto.checklist_responses.map((item) => {
        const checklistItem = checklistItemMap.get(item.checklist_item_id);

        if (!checklistItem) {
          throw new BadRequestException(
            `Invalid checklist_item_id: ${item.checklist_item_id}`,
          );
        }

        return {
          entry_id: checkIn.entry_id,
          checklist_item_id: item.checklist_item_id,
          checklist_category_id: checklistItem.checklist_category_id,
          item_text_snapshot: checklistItem.item_text,
          item_type: checklistItem.item_type,
          response_value: item.response_value,
          is_compliant: item.response_value,
          display_order: checklistItem.display_order,
        };
      });

      // bulk insert check-in responses
      await tx.ops_checkin_response.createMany({
        data: responsesData,
      });

      // last priority today
      const lastPriority = await this.findLastPriorityToday();
      const lastPrioritySeq = lastPriority ? lastPriority.priority_order : 0;
      const nextPriority = lastPrioritySeq + 1;

      // insert queue status
      await tx.ops_queue_status.create({
        data: {
          entry_id: checkIn.entry_id,
          queue_number: queueNumber,
          current_status: 'MENUNGGU',
          status_display_text: 'Menunggu Verifikasi',
          priority_order: nextPriority,
        },
      });

      // Return hasil (commit otomatis kalau nggak error)
      return {
        queue_number: queueNumber,
        company_name: vendor.company_name,
        driver_name: createCheckInDto.driver_name,
        current_status: 'MENUNGGU',
        submission_time: new Date(),
      };
    });
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
}
