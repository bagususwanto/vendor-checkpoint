import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { SlotGeneratorJob } from './jobs/slot-generator.job';

@Controller('scheduler')
@UseInterceptors(AuditLogInterceptor)
export class SchedulerController {
  constructor(private readonly slotGeneratorJob: SlotGeneratorJob) {}

  @UseGuards(JwtAuthGuard)
  @Post('trigger-slot-generator')
  async triggerSlotGenerator() {
    await this.slotGeneratorJob.handleCron();
    return {
      message: 'Slot generator executed successfully.',
    };
  }
}
