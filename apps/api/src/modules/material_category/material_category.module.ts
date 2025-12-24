import { Module } from '@nestjs/common';
import { MaterialCategoryService } from './material_category.service';
import { MaterialCategoryController } from './material_category.controller';

@Module({
  controllers: [MaterialCategoryController],
  providers: [MaterialCategoryService],
  exports: [MaterialCategoryService],
})
export class MaterialCategoryModule {}
