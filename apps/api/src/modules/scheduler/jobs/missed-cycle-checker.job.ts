import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class MissedCycleCheckerJob {
  private readonly logger = new Logger(MissedCycleCheckerJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 7 * * *') // Runs at 07:00 AM everyday (before new day cut-off)
  async handleCron() {
    this.logger.debug('Running missed cycle checker job...');
    const now = new Date();
    // Start of calendar today (e.g., 2026-04-28 00:00:00)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // Find all 'Open' slots for dates < today (i.e., operational yesterday and before)
    const missedSlots = await this.prisma.ops_delivery_slot.findMany({
      where: {
        status: 'Open',
        expected_date: {
          lt: startOfToday,
        },
      },
    });

    for (const slot of missedSlots) {
      await this.prisma.ops_delivery_slot.update({
        where: { slot_id: slot.slot_id },
        data: { status: 'Missed' },
      });

      await this.prisma.log_audit.create({
        data: {
          action_type: 'SLOT_MISSED',
          action_description: `Delivery slot ${slot.slot_id} marked as missed`,
        },
      });

      this.logger.debug(`Marked slot ${slot.slot_id} as Missed`);
    }
  }
}
