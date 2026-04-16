import { Module } from '@nestjs/common';
import { VendorCategoryService } from './vendor_category.service';
import { VendorCategoryController } from './vendor_category.controller';

import { AuditModule } from '../audit/audit.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [AuditModule, PrismaModule],
  controllers: [VendorCategoryController],
  providers: [VendorCategoryService],
  exports: [VendorCategoryService],
})
export class VendorCategoryModule {}
