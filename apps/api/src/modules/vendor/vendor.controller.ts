import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { FindVendorParamsDto } from './dto/find-vendor-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('vendor')
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

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.update(id, updateVendorDto);
  }

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.toggleActive(id);
  }

  // PROTECTED - Admin only - Sync from external API
  @UseGuards(JwtAuthGuard)
  @Post('sync')
  syncFromExternal() {
    return this.vendorService.syncFromExternalApi();
  }
}
