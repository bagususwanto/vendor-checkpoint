import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ReportService } from './report.service';
import { ReportFilterDto } from './dto/report-filter.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getPreview(
    @Query(new ValidationPipe({ transform: true })) filter: ReportFilterDto,
  ) {
    return this.reportService.getPreview(filter);
  }

  @Get('export')
  async exportExcel(
    @Query(new ValidationPipe({ transform: true })) filter: ReportFilterDto,
    @Res() res: Response,
  ) {
    const buffer = await this.reportService.generateExcel(filter);

    const filename = `report_${filter.dateFrom}_${filter.dateTo}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  }
}
