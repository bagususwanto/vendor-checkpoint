import {
  Controller,
  Get,
  Query,
  Res,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ReportService } from './report.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { AuditLogFilterDto } from './dto/audit-log-filter.dto';

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

  @Get('audit-logs')
  async getAuditLogs(
    @Query(new ValidationPipe({ transform: true })) filter: AuditLogFilterDto,
  ) {
    return this.reportService.getAuditLogs(filter);
  }

  @Get('audit-logs/export')
  async exportAuditLogs(
    @Query(new ValidationPipe({ transform: true })) filter: AuditLogFilterDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    const { buffer, filename } = await this.reportService.generateAuditLogExcel(
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
}
