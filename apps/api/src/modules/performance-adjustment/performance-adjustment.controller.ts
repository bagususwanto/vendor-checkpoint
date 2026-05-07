import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@repo/types';
import { PerformanceAdjustmentService } from './performance-adjustment.service';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { AdjustmentFilterDto } from './dto/adjustment-filter.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('performance-adjustment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PerformanceAdjustmentController {
  constructor(private readonly service: PerformanceAdjustmentService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECTION_HEAD)
  async create(
    @Body(new ZodValidationPipe(CreateAdjustmentDto)) dto: CreateAdjustmentDto,
    @Req() req: any,
  ) {
    return this.service.create(dto, req.user.sub || req.user.user_id);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECTION_HEAD)
  async findAll(
    @Query(new ZodValidationPipe(AdjustmentFilterDto)) filter: AdjustmentFilterDto,
  ) {
    return this.service.findAll(filter);
  }

  @Get('entry/:entryId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECTION_HEAD)
  async findByEntryId(@Param('entryId', ParseIntPipe) entryId: number) {
    return this.service.findByEntryId(entryId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECTION_HEAD)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SECTION_HEAD)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.service.remove(id, req.user.sub || req.user.user_id);
  }
}
