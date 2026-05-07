import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { SlotGeneratorJob } from './jobs/slot-generator.job';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '@repo/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('scheduler')
@UseInterceptors(AuditLogInterceptor)
export class SchedulerController {
  constructor(private readonly slotGeneratorJob: SlotGeneratorJob) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.GROUP_HEAD,
    UserRole.LINE_HEAD,
    UserRole.SECTION_HEAD,
    UserRole.WAREHOUSE_STAFF,
    UserRole.WAREHOUSE_MEMBER,
  )
  @Post('trigger-slot-generator')
  async triggerSlotGenerator() {
    await this.slotGeneratorJob.handleCron();
    return {
      message: 'Slot generator executed successfully.',
    };
  }
}
