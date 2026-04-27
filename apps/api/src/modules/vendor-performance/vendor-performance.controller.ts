import { Controller, Get, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { VendorPerformanceService } from './vendor-performance.service';
import { VendorPerformanceFilterDto } from './dto/vendor-performance-filter.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('vendor-performance')
@UseGuards(JwtAuthGuard)
export class VendorPerformanceController {
  constructor(private readonly vendorPerformanceService: VendorPerformanceService) {}

  @Get('ranking')
  async getRanking(
    @Query(new ZodValidationPipe(VendorPerformanceFilterDto))
    filter: VendorPerformanceFilterDto,
  ) {
    return this.vendorPerformanceService.getRanking(filter);
  }

  @Get('trend')
  async getTrend(
    @Query(new ZodValidationPipe(VendorPerformanceFilterDto))
    filter: VendorPerformanceFilterDto,
  ) {
    return this.vendorPerformanceService.getTrend(filter);
  }

  @Get('detail/:vendorId')
  async getVendorDetail(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Query(new ZodValidationPipe(VendorPerformanceFilterDto))
    filter: VendorPerformanceFilterDto,
  ) {
    return this.vendorPerformanceService.getVendorDetail(vendorId, filter);
  }
}
