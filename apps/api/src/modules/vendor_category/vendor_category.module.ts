import { Module } from '@nestjs/common';
import { VendorCategoryService } from './vendor_category.service';
import { VendorCategoryController } from './vendor_category.controller';

@Module({
  controllers: [VendorCategoryController],
  providers: [VendorCategoryService],
  exports: [VendorCategoryService],
})
export class VendorCategoryModule {}
