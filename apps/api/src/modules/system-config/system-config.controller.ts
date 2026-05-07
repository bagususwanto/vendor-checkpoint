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
import { SystemConfigService } from './system-config.service';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { FindSystemConfigParamsDto } from './dto/find-system-config-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '@repo/types';
import { Roles } from 'src/common/decorators/roles.decorator';

// All system-config routes are protected - system settings
@Controller('system-config')
@UseInterceptors(AuditLogInterceptor)
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Get()
  findAll(@Query() query: FindSystemConfigParamsDto) {
    return this.systemConfigService.findAll(query);
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.systemConfigService.findByConfigKey(key);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemConfigService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Patch(':id')
  @AuditLog({
    actionType: 'SYSTEM_CONFIG_UPDATE',
    actionDescription: 'System Configuration updated',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: res.old_value,
      new_value: res.new_value,
    }),
  })
  update(
    @Param('id') id: string,
    @Body() updateSystemConfigDto: UpdateSystemConfigDto,
  ) {
    return this.systemConfigService.update(+id, updateSystemConfigDto);
  }
}
