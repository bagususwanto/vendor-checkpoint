import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/stats')
  async findDailyStats() {
    return this.dashboardService.findDailyStats();
  }

  @Get('/hourly-lead-time')
  async findHourlyLeadTime() {
    return this.dashboardService.findHourlyLeadTime();
  }

  @Get('/hourly-compliance')
  async findHourlyCompliance() {
    return this.dashboardService.findComplianceRateByHour();
  }

  @Get('/checklist-breakdown')
  async findChecklistBreakdown() {
    return this.dashboardService.findChecklistBreakdown();
  }
}
