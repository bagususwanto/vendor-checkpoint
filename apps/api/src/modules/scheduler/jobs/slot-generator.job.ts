import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class SlotGeneratorJob {
  private readonly logger = new Logger(SlotGeneratorJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Running slot generator job...');
    const today = new Date();
    // Monday is 1, Sunday is 7
    let currentDayOfWeek = today.getDay();
    if (currentDayOfWeek === 0) currentDayOfWeek = 7;

    const schedules = await this.prisma.mst_vendor_schedule.findMany({
      where: {
        is_active: true,
        day_of_week: currentDayOfWeek,
      },
    });

    for (const schedule of schedules) {
      // Check if slot already exists for today
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

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
