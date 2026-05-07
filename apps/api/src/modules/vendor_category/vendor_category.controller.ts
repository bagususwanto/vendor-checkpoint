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
import { VendorCategoryService } from './vendor_category.service';
import { CreateVendorCategoryDto } from './dto/create-vendor_category.dto';
import { UpdateVendorCategoryDto } from './dto/update-vendor_category.dto';
import { BulkDeleteVendorCategoryDto } from './dto/bulk-delete-vendor_category.dto';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '@repo/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('vendor-categories')
@UseInterceptors(AuditLogInterceptor)
export class VendorCategoryController {
  constructor(
    private readonly vendorCategoryService: VendorCategoryService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Post()
  @AuditLog({
    actionType: 'VENDOR_CATEGORY_CREATE',
    actionDescription: 'Vendor Category created',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      new_value: res,
    }),
  })
  create(@Body() createVendorCategoryDto: CreateVendorCategoryDto) {
    return this.vendorCategoryService.create(createVendorCategoryDto);
  }

  @Get('selection')
  getSelection() {
    return this.vendorCategoryService.getSelection();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.GROUP_HEAD,
    UserRole.LINE_HEAD,
    UserRole.SECTION_HEAD,
    UserRole.WAREHOUSE_STAFF,
    UserRole.WAREHOUSE_MEMBER,
  )
  @Get()
  findAll(@Query() query: PaginatedParamsDto) {
    return this.vendorCategoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorCategoryService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Patch(':id')
  @AuditLog({
    actionType: 'VENDOR_CATEGORY_UPDATE',
    actionDescription: 'Vendor Category updated',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: res.old_value,
      new_value: res.new_value,
    }),
  })
  update(
    @Param('id') id: string,
    @Body() updateVendorCategoryDto: UpdateVendorCategoryDto,
  ) {
    return this.vendorCategoryService.update(+id, updateVendorCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Delete(':id')
  @AuditLog({
    actionType: 'VENDOR_CATEGORY_DELETE',
    actionDescription: 'Vendor Category deleted',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: res,
    }),
  })
  remove(@Param('id') id: string) {
    return this.vendorCategoryService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Delete()
  @HttpCode(HttpStatus.OK)
  @AuditLog({
    actionType: 'VENDOR_CATEGORY_BULK_DELETE',
    actionDescription: 'Vendor Categories bulk deleted',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: { ids: req.body.ids },
    }),
  })
  bulkDelete(@Body() bulkDeleteDto: BulkDeleteVendorCategoryDto) {
    return this.vendorCategoryService.bulkDelete(bulkDeleteDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.GROUP_HEAD, UserRole.LINE_HEAD)
  @Patch(':id/toggle-status')
  @AuditLog({
    actionType: 'VENDOR_CATEGORY_TOGGLE_STATUS',
    actionDescription: 'Vendor Category status toggled',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      new_value: res,
    }),
  })
  toggleStatus(@Param('id') id: string) {
    return this.vendorCategoryService.toggleStatus(+id);
  }
}
