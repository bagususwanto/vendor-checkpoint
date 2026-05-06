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
    // 1. Dapatkan waktu Jakarta saat ini
    const now = new Date();
    const jakartaTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
    );

    // 2. Tentukan Tanggal Operasional (Shift Logic)
    // Jika jam sekarang < 07:00 pagi WIB, maka masih dianggap hari operasional sebelumnya
    const operationalDate = new Date(jakartaTime);
    if (jakartaTime.getHours() < 7) {
      operationalDate.setDate(jakartaTime.getDate() - 1);
    }

    // Buat rentang waktu untuk tanggal operasional tersebut (00:00:00 - 23:59:59)
    // Karena kolom expected_date di DB adalah DATE, kita cukup bandingkan dengan tanggal tersebut
    const targetDate = new Date(
      Date.UTC(
        operationalDate.getFullYear(),
        operationalDate.getMonth(),
        operationalDate.getDate(),
      ),
    );

    const slots = await this.prisma.ops_delivery_slot.findMany({
      where: {
        expected_date: targetDate,
      },
      include: {
        schedule: {
          include: {
            vendor: {
              include: {
                vendor_category: true,
              },
            },
          },
        },
        ops_checkin_entry: {
          orderBy: { submission_time: 'desc' },
          take: 1,
          include: {
            ops_timelog: true,
          },
        },
      },
    });

    // 3. Custom sort untuk menangani logika shift saat display
    // Jam 00:00 - 06:59 diletakkan di akhir urutan hari operasional
    slots.sort((a, b) => {
      const getSortValue = (timeStr?: string | null) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        // Jika jam < 7, tambahkan 24 jam agar berada di akhir daftar hari operasional
        return h < 7 ? (h + 24) * 60 + (m || 0) : h * 60 + (m || 0);
      };

      return (
        getSortValue(a.schedule?.arrival_time) -
        getSortValue(b.schedule?.arrival_time)
      );
    });

    return slots;
  }
}
