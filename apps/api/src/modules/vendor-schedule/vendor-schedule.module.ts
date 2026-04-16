import { Module } from '@nestjs/common';
import { VendorScheduleService } from './vendor-schedule.service';
import { VendorScheduleController } from './vendor-schedule.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [VendorScheduleController],
  providers: [VendorScheduleService],
})
export class VendorScheduleModule {}
