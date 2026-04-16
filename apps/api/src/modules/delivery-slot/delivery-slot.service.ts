import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindDeliverySlotDto, FindMissedSlotDto } from './dto/slot-query.dto';

@Injectable()
export class DeliverySlotService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindDeliverySlotDto) {
    const { date, status, vendor_id } = query;
    return this.prisma.ops_delivery_slot.findMany({
      where: {
        expected_date: date ? new Date(date) : undefined,
        status: status ? status : undefined,
        schedule: vendor_id ? { vendor_id } : undefined,
      },
      include: {
        schedule: {
          include: {
            vendor: true,
          },
        },
        ops_checkin_entry: true,
      },
      orderBy: { expected_date: 'desc' },
    });
  }

  async findMissed(query: FindMissedSlotDto) {
    const { dateFrom, dateTo } = query;
    return this.prisma.ops_delivery_slot.findMany({
      where: {
        status: 'Missed',
        expected_date: {
          gte: dateFrom ? new Date(dateFrom) : undefined,
          lte: dateTo ? new Date(dateTo) : undefined,
        },
      },
      include: {
        schedule: {
          include: {
            vendor: true,
          },
        },
      },
      orderBy: { expected_date: 'desc' },
    });
  }
}
