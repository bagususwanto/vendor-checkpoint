import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DelayReasonService } from './delay-reason.service';
import { CreateDelayReasonDto } from './dto/create-delay-reason.dto';
import { UpdateDelayReasonDto } from './dto/update-delay-reason.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '@repo/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('delay-reasons')
@UseInterceptors(AuditLogInterceptor)
export class DelayReasonController {
  constructor(private readonly delayReasonService: DelayReasonService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Post()
  @AuditLog({
    actionType: 'DELAY_REASON_CREATE',
    actionDescription: 'Delay reason created',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      new_value: res,
    }),
  })
  create(@Body() createDelayReasonDto: CreateDelayReasonDto) {
    return this.delayReasonService.create(createDelayReasonDto);
  }

  @Get()
  findAll(
    @Query() query: import('src/common/dto/paginated-params.dto').PaginatedParamsDto,
    @Query('category') category?: string,
  ) {
    return this.delayReasonService.findAll(query, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delayReasonService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Patch(':id')
  @AuditLog({
    actionType: 'DELAY_REASON_UPDATE',
    actionDescription: 'Delay reason updated',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      new_value: res.new_value,
    }),
  })
  update(
    @Param('id') id: string,
    @Body() updateDelayReasonDto: UpdateDelayReasonDto,
  ) {
    return this.delayReasonService.update(+id, updateDelayReasonDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Delete(':id')
  @AuditLog({
    actionType: 'DELAY_REASON_DELETE',
    actionDescription: 'Delay reason deleted',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: res,
    }),
  })
  remove(@Param('id') id: string) {
    return this.delayReasonService.remove(+id);
  }
}
