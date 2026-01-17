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
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { FindVendorParamsDto } from './dto/find-vendor-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  // PUBLIC - Dropdown di form check-in
  @Get()
  findAll(@Query() query: FindVendorParamsDto) {
    return this.vendorService.findAll(query);
  }

  // PUBLIC - Detail vendor di form check-in
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(+id);
  }

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(+id, updateVendorDto);
  }

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(+id);
  }
}
