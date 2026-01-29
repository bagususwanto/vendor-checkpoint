import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { FindVendorParamsDto } from './dto/find-vendor-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Controller('vendor')
@UseInterceptors(AuditLogInterceptor)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // PUBLIC - Dropdown di form check-in
  @Get()
  findAll(@Query() query: FindVendorParamsDto) {
    return this.vendorService.findAll(query);
  }

  // PUBLIC - Detail vendor
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.findOne(id);
  }

  // PROTECTED - Admin only - Sync from external API
  @UseGuards(JwtAuthGuard)
  @Post('sync')
  @AuditLog({
    actionType: 'VENDOR_SYNC',
    actionDescription: 'Sync vendors from external API',
    buildDetails: (req, res) => ({
      new_value: res,
    }),
  })
  syncFromExternal() {
    return this.vendorService.syncFromExternalApi();
  }
}
