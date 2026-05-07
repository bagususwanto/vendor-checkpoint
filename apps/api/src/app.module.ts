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
import { VendorCategoryModule } from './modules/vendor_category/vendor_category.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportModule } from './modules/report/report.module';
import { UserModule } from './modules/user/user.module';
import { DelayReasonModule } from './modules/delay-reason/delay-reason.module';
import { VendorScheduleModule } from './modules/vendor-schedule/vendor-schedule.module';
import { DeliverySlotModule } from './modules/delivery-slot/delivery-slot.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { VendorPerformanceModule } from './modules/vendor-performance/vendor-performance.module';
import { PerformanceAdjustmentModule } from './modules/performance-adjustment/performance-adjustment.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
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
    VendorCategoryModule,
    DashboardModule,
    ReportModule,
    UserModule,
    DelayReasonModule,
    VendorScheduleModule,
    DeliverySlotModule,
    SchedulerModule,
    VendorPerformanceModule,
    PerformanceAdjustmentModule,
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
