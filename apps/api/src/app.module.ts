import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { VendorCategoryModule } from './modules/vendor-category/vendor-category.module';
import { SystemConfigModule } from './modules/system-config/system-config.module';

@Module({
  imports: [AuthModule, VendorModule, PrismaModule, ChecklistModule, CheckInModule, VendorCategoryModule, SystemConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
