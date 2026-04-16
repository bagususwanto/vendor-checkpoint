import { Module } from '@nestjs/common';
import { VendorScheduleService } from './vendor-schedule.service';
import { VendorScheduleController } from './vendor-schedule.controller';

@Module({
  controllers: [VendorScheduleController],
  providers: [VendorScheduleService],
})
export class VendorScheduleModule {}
