import { Module } from '@nestjs/common';
import { PerformanceAdjustmentService } from './performance-adjustment.service';
import { PerformanceAdjustmentController } from './performance-adjustment.controller';

@Module({
  controllers: [PerformanceAdjustmentController],
  providers: [PerformanceAdjustmentService],
  exports: [PerformanceAdjustmentService],
})
export class PerformanceAdjustmentModule {}
