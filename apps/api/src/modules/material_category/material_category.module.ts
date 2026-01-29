import { Module } from '@nestjs/common';
import { MaterialCategoryService } from './material_category.service';
import { MaterialCategoryController } from './material_category.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [MaterialCategoryController],
  providers: [MaterialCategoryService],
  exports: [MaterialCategoryService],
})
export class MaterialCategoryModule {}
