import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaterialCategoryService } from './material_category.service';
import { CreateMaterialCategoryDto } from './dto/create-material_category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material_category.dto';

@Controller('material-category')
export class MaterialCategoryController {
  constructor(private readonly materialCategoryService: MaterialCategoryService) {}

  @Post()
  create(@Body() createMaterialCategoryDto: CreateMaterialCategoryDto) {
    return this.materialCategoryService.create(createMaterialCategoryDto);
  }

  @Get()
  findAll() {
    return this.materialCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialCategoryDto: UpdateMaterialCategoryDto) {
    return this.materialCategoryService.update(+id, updateMaterialCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialCategoryService.remove(+id);
  }
}
