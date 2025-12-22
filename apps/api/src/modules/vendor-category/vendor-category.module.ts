import { Module } from '@nestjs/common';
import { VendorCategoryService } from './vendor-category.service';
import { VendorCategoryController } from './vendor-category.controller';

@Module({
  controllers: [VendorCategoryController],
  providers: [VendorCategoryService],
  exports: [VendorCategoryService],
})
export class VendorCategoryModule {}
