import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { AuditLogFilterDto } from './dto/audit-log-filter.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ZodValidationPipe } from 'nestjs-zod';

// All audit routes are protected - sensitive data
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  create(@Body() createAuditDto: CreateAuditDto) {
    return this.auditService.create(null, createAuditDto);
  }

  @Get()
  findAll(
    @Query(new ZodValidationPipe(AuditLogFilterDto)) filter: AuditLogFilterDto,
  ) {
    return this.auditService.getAuditLogs(filter);
  }

  @Get('export')
  async exportAuditLogs(
    @Query(new ZodValidationPipe(AuditLogFilterDto)) filter: AuditLogFilterDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    const { buffer, filename } = await this.auditService.generateAuditLogExcel(
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(+id, updateAuditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.remove(+id);
  }
}
