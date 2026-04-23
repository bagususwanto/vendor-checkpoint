import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class MissedCycleCheckerJob {
  private readonly logger = new Logger(MissedCycleCheckerJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 17 * * *') // Runs at 5 PM everyday
  async handleCron() {
    this.logger.debug('Running missed cycle checker job...');
    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all 'Open' slots for dates <= today
    const missedSlots = await this.prisma.ops_delivery_slot.findMany({
      where: {
        status: 'Open',
        expected_date: {
          lte: endOfDay,
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
