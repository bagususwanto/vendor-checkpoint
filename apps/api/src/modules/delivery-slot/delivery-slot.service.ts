import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FindDeliverySlotDto, FindMissedSlotDto } from './dto/slot-query.dto';

@Injectable()
export class DeliverySlotService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindDeliverySlotDto) {
    const {
      date,
      dateFrom,
      dateTo,
      status,
      vendor_id,
      page = 1,
      limit = 10,
    } = query;

    const where = {
      expected_date: date
        ? new Date(date)
        : dateFrom || dateTo
          ? {
              gte: dateFrom ? new Date(dateFrom) : undefined,
              lte: dateTo ? new Date(dateTo) : undefined,
            }
          : undefined,
      status: status ? status : undefined,
      schedule: vendor_id ? { vendor_id } : undefined,
    };

    const [total, data] = await Promise.all([
      this.prisma.ops_delivery_slot.count({ where }),
      this.prisma.ops_delivery_slot.findMany({
        where,
        include: {
          schedule: {
            include: {
              vendor: true,
            },
          },
          ops_checkin_entry: true,
        },
        orderBy: { expected_date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
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
    const startOfTodayUtc = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
    );
    const endOfTodayUtc = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      ),
    );

    // Opsi B: Gunakan juga waktu lokal Jakarta jika UTC tidak menemukan hasil (mencakup pergantian hari)
    const jakartaTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
    );
    const startOfJakarta = new Date(jakartaTime);
    startOfJakarta.setHours(0, 0, 0, 0);
    const endOfJakarta = new Date(jakartaTime);
    endOfJakarta.setHours(23, 59, 59, 999);

    const slots = await this.prisma.ops_delivery_slot.findMany({
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
          },
        ],
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
    });

    // Custom sort to handle shift logic: 00:00 - 06:59 is considered the end of the operational day
    slots.sort((a, b) => {
      // First sort by expected_date
      const dateA = a.expected_date.getTime();
      const dateB = b.expected_date.getTime();
      if (dateA !== dateB) return dateA - dateB;

      // Then sort by arrival_time with shift logic (times < 07:00 moved to end of day)
      const getSortValue = (timeStr?: string | null) => {
        if (!timeStr) return 0;
        const parts = timeStr.split(':').map(Number);
        const h = parts[0] ?? 0;
        const m = parts[1] ?? 0;
        return h < 7 ? (h + 24) * 60 + m : h * 60 + m;
      };

      return (
        getSortValue(a.schedule?.arrival_time) -
        getSortValue(b.schedule?.arrival_time)
      );
    });

    return slots;
  }
}
