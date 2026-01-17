import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

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
  findAll() {
    return this.auditService.findAll();
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
