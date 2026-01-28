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
} from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { FindSystemConfigParamsDto } from './dto/find-system-config-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

// All system-config routes are protected - system settings
@UseGuards(JwtAuthGuard)
@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @Get()
  findAll(@Query() query: FindSystemConfigParamsDto) {
    return this.systemConfigService.findAll(query);
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.systemConfigService.findByConfigKey(key);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemConfigService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSystemConfigDto: UpdateSystemConfigDto,
  ) {
    return this.systemConfigService.update(+id, updateSystemConfigDto);
  }
}
