import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { VendorCategoryModule } from '../vendor_category/vendor_category.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [VendorCategoryModule, AuditModule],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
