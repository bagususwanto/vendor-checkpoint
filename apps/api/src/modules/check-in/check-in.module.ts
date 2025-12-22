import { Module } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { VendorModule } from '../vendor/vendor.module';
import { SystemConfigModule } from '../system-config/system-config.module';
import { ChecklistModule } from '../checklist/checklist.module';


import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    VendorModule,
    SystemConfigModule,
    ChecklistModule,


    AuditModule,
  ],
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
