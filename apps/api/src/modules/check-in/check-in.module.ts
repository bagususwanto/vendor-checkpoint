import { Module } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { VendorModule } from '../vendor/vendor.module';
import { SystemConfigModule } from '../system-config/system-config.module';
import { ChecklistModule } from '../checklist/checklist.module';

@Module({
  imports: [VendorModule, SystemConfigModule, ChecklistModule],
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
