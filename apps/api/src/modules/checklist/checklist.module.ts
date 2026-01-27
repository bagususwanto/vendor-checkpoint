import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';
import { MaterialCategoryModule } from '../material_category/material_category.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [MaterialCategoryModule, AuditModule],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
