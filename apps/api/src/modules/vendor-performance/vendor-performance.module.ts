import { Module } from '@nestjs/common';
import { VendorPerformanceController } from './vendor-performance.controller';
import { VendorPerformanceService } from './vendor-performance.service';

@Module({
  controllers: [VendorPerformanceController],
  providers: [VendorPerformanceService],
  exports: [VendorPerformanceService],
})
export class VendorPerformanceModule {}
