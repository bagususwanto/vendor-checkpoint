import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class SlotGeneratorJob {
  private readonly logger = new Logger(SlotGeneratorJob.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Job ini berjalan otomatis setiap hari pada jam 07:00.
   * Bisa mengubah jadwalnya pada decorator Cron di bawah ini.
   * Format: 'detik menit jam hari-dalam-bulan bulan hari-dalam-minggu'
   */
  @Cron('0 15 7 * * *') // 07:15 AM every day
  async handleCron() {
    this.logger.debug('Running slot generator job...');
    const today = new Date();
    // Monday is 1, Sunday is 7
    let currentDayOfWeek = today.getDay();
    if (currentDayOfWeek === 0) currentDayOfWeek = 7;

    // Filter ini menentukan jadwal mana yang akan dibuatkan slotnya.
    // Saat ini hanya mengambil yang aktif (is_active: true) dan sesuai hari ini.
    const schedules = await this.prisma.mst_vendor_schedule.findMany({
      where: {
        is_active: true,
        day_of_week: currentDayOfWeek,
      },
    });

    for (const schedule of schedules) {
      // Check if slot already exists for today
      // Gunakan Date.UTC agar tanggal hari ini dibuat pada jam 00:00 UTC.
      // Jika pakai startOfDay.setHours(0,0,0,0), itu menjadi jam 00:00 lokal (misal: UTC+7)
      // yang ketika di-save oleh Prisma bisa terkonversi mundur menjadi H-1 17:00 UTC untuk kolom @db.Date.
      const startOfDay = new Date(
        Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
          0,
        ),
      );

      const endOfDay = new Date(
        Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999,
        ),
      );

      const existing = await this.prisma.ops_delivery_slot.findFirst({
        where: {
          schedule_id: schedule.schedule_id,
          expected_date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (!existing) {
        // Status default saat slot dibuat adalah 'Open'.
        // Anda bisa mengubah status awal di sini jika diperlukan.
        await this.prisma.ops_delivery_slot.create({
          data: {
            schedule_id: schedule.schedule_id,
            expected_date: startOfDay,
            status: 'Open',
          },
        });
        this.logger.debug(`Created slot for schedule ${schedule.schedule_id}`);
      }
    }
  }
}
