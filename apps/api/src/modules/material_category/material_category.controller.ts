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
  UseInterceptors,
} from '@nestjs/common';
import { MaterialCategoryService } from './material_category.service';
import { CreateMaterialCategoryDto } from './dto/create-material_category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material_category.dto';
import { BulkDeleteMaterialCategoryDto } from './dto/bulk-delete-material_category.dto';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';

@Controller('material-category')
@UseInterceptors(AuditLogInterceptor)
export class MaterialCategoryController {
  constructor(
    private readonly materialCategoryService: MaterialCategoryService,
  ) {}

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Post()
  @AuditLog({
    actionType: 'MATERIAL_CATEGORY_CREATE',
    actionDescription: 'Material Category created',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      new_value: res,
    }),
  })
  create(@Body() createMaterialCategoryDto: CreateMaterialCategoryDto) {
    return this.materialCategoryService.create(createMaterialCategoryDto);
  }

  @Get('selection')
  getSelection() {
    return this.materialCategoryService.getSelection();
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
  @AuditLog({
    actionType: 'MATERIAL_CATEGORY_UPDATE',
    actionDescription: 'Material Category updated',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: res.old_value,
      new_value: res.new_value,
    }),
  })
  update(
    @Param('id') id: string,
    @Body() updateMaterialCategoryDto: UpdateMaterialCategoryDto,
  ) {
    return this.materialCategoryService.update(+id, updateMaterialCategoryDto);
  }

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @AuditLog({
    actionType: 'MATERIAL_CATEGORY_DELETE',
    actionDescription: 'Material Category deleted',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: res,
    }),
  })
  remove(@Param('id') id: string) {
    return this.materialCategoryService.remove(+id);
  }

  // PROTECTED - Admin only - Bulk delete
  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  @AuditLog({
    actionType: 'MATERIAL_CATEGORY_BULK_DELETE',
    actionDescription: 'Material Categories bulk deleted',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: { ids: req.body.ids },
    }),
  })
  bulkDelete(@Body() bulkDeleteDto: BulkDeleteMaterialCategoryDto) {
    return this.materialCategoryService.bulkDelete(bulkDeleteDto);
  }

  // PROTECTED - Admin only - Toggle status
  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-status')
  @AuditLog({
    actionType: 'MATERIAL_CATEGORY_TOGGLE_STATUS',
    actionDescription: 'Material Category status toggled',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      new_value: res,
    }),
  })
  toggleStatus(@Param('id') id: string) {
    return this.materialCategoryService.toggleStatus(+id);
  }
}
