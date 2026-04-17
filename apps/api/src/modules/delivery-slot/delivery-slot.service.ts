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

  async findTodayMonitor() {
    // Gunakan UTC untuk konsistensi dengan SlotGeneratorJob
    const now = new Date();
    
    // Cari data untuk "Hari Ini" dalam format UTC YYYY-MM-DD
    const startOfTodayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
    const endOfTodayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));

    // Opsi B: Gunakan juga waktu lokal Jakarta jika UTC tidak menemukan hasil (mencakup pergantian hari)
    const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const startOfJakarta = new Date(jakartaTime);
    startOfJakarta.setHours(0,0,0,0);
    const endOfJakarta = new Date(jakartaTime);
    endOfJakarta.setHours(23,59,59,999);

    return this.prisma.ops_delivery_slot.findMany({
      where: {
        OR: [
          {
            expected_date: {
              gte: startOfTodayUtc,
              lte: endOfTodayUtc,
            },
          },
          {
            expected_date: {
              gte: startOfJakarta,
              lte: endOfJakarta,
            },
          }
        ]
      },
      include: {
        schedule: {
          include: { vendor: { include: { vendor_category: true } } },
        },
        ops_checkin_entry: {
          orderBy: { submission_time: 'desc' },
          take: 1,
          include: { ops_timelog: true },
        },
      },
      orderBy: [
        { schedule: { arrival_time: 'asc' } },
      ],
    });
  }
}
