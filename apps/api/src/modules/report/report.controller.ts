import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ReportService } from './report.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { ReportExportLogFilterDto } from './dto/report-export-log-filter.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getPreview(
    @Query(new ZodValidationPipe(ReportFilterDto)) filter: ReportFilterDto,
  ) {
    return this.reportService.getPreview(filter);
  }

  @Get('export')
  async exportExcel(
    @Query(new ZodValidationPipe(ReportFilterDto)) filter: ReportFilterDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    const { buffer, filename } = await this.reportService.generateExcel(
      filter,
      userId,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  }

  @Get('export-logs')
  async getExportLogs(
    @Query(new ZodValidationPipe(ReportExportLogFilterDto))
    filter: ReportExportLogFilterDto,
  ) {
    return this.reportService.getExportLogs(filter);
  }
}
