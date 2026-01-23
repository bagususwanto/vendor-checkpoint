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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MaterialCategoryService } from './material_category.service';
import { CreateMaterialCategoryDto } from './dto/create-material_category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material_category.dto';
import { BulkDeleteMaterialCategoryDto } from './dto/bulk-delete-material_category.dto';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('material-category')
export class MaterialCategoryController {
  constructor(
    private readonly materialCategoryService: MaterialCategoryService,
  ) {}

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMaterialCategoryDto: CreateMaterialCategoryDto) {
    return this.materialCategoryService.create(createMaterialCategoryDto);
  }

  // PUBLIC - Dropdown di form check-in
  @Get()
  findAll(@Query() query: PaginatedParamsDto) {
    return this.materialCategoryService.findAll(query);
  }

  // PUBLIC - Detail category
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialCategoryService.findOne(+id);
  }

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialCategoryDto: UpdateMaterialCategoryDto,
  ) {
    return this.materialCategoryService.update(+id, updateMaterialCategoryDto);
  }

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialCategoryService.remove(+id);
  }

  // PROTECTED - Admin only - Bulk delete
  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  bulkDelete(@Body() bulkDeleteDto: BulkDeleteMaterialCategoryDto) {
    return this.materialCategoryService.bulkDelete(bulkDeleteDto);
  }

  // PROTECTED - Admin only - Toggle status
  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.materialCategoryService.toggleStatus(+id);
  }
}
