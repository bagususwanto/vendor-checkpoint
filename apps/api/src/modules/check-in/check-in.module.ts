import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { VendorModule } from '../vendor/vendor.module';
import { SystemConfigModule } from '../system-config/system-config.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { AuditModule } from '../audit/audit.module';
import { VendorCategoryModule } from '../vendor_category/vendor_category.module';

@Module({
  imports: [
    HttpModule,
    VendorModule,
    SystemConfigModule,
    ChecklistModule,
    AuditModule,
    VendorCategoryModule,
  ],
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
