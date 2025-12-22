import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendorCategoryService } from './vendor-category.service';
import { CreateVendorCategoryDto } from './dto/create-vendor-category.dto';
import { UpdateVendorCategoryDto } from './dto/update-vendor-category.dto';

@Controller('vendor-category')
export class VendorCategoryController {
  constructor(private readonly vendorCategoryService: VendorCategoryService) {}

  @Post()
  create(@Body() createVendorCategoryDto: CreateVendorCategoryDto) {
    return this.vendorCategoryService.create(createVendorCategoryDto);
  }

  @Get()
  findAll() {
    return this.vendorCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorCategoryDto: UpdateVendorCategoryDto) {
    return this.vendorCategoryService.update(+id, updateVendorCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorCategoryService.remove(+id);
  }
}
