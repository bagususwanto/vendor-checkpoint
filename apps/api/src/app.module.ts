import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { SystemConfigModule } from './modules/system-config/system-config.module';
import { AuditModule } from './modules/audit/audit.module';
import { MaterialCategoryModule } from './modules/material_category/material_category.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    AuthModule,
    VendorModule,
    PrismaModule,
    ChecklistModule,
    CheckInModule,
    SystemConfigModule,
    AuditModule,
    MaterialCategoryModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
