import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { SlotGeneratorJob } from './jobs/slot-generator.job';
import { MissedCycleCheckerJob } from './jobs/missed-cycle-checker.job';
import { SchedulerController } from './scheduler.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SchedulerController],
  providers: [SchedulerService, SlotGeneratorJob, MissedCycleCheckerJob],
})
export class SchedulerModule {}
