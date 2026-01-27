import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { CreateChecklistCategoryDto } from './dto/create-category.dto';
import { UpdateChecklistCategoryDto } from './dto/update-category.dto';
import { CreateChecklistItemDto } from './dto/create-item.dto';
import { UpdateChecklistItemDto } from './dto/update-item.dto';
import { ReorderDto } from './dto/reorder.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  // --- Category Endpoints ---

  @UseGuards(JwtAuthGuard)
  @Post('category')
  createCategory(@Body() dto: CreateChecklistCategoryDto) {
    return this.checklistService.createCategory(dto);
  }

  // PUBLIC (Management? Or Protected?) -> Let's make it protected for management
  @Get('categories')
  findAllCategories() {
    return this.checklistService.findAllCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('category/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateChecklistCategoryDto,
  ) {
    return this.checklistService.updateCategory(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('category/:id')
  deleteCategory(@Param('id') id: string) {
    return this.checklistService.deleteCategory(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('category/reorder')
  reorderCategories(@Body() dto: ReorderDto) {
    return this.checklistService.reorderCategories(dto);
  }

  // --- Item Endpoints ---

  @UseGuards(JwtAuthGuard)
  @Post('item')
  createItem(@Body() dto: CreateChecklistItemDto) {
    return this.checklistService.createItem(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('item/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateChecklistItemDto) {
    return this.checklistService.updateItem(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('item/:id')
  deleteItem(@Param('id') id: string) {
    return this.checklistService.deleteItem(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('item/reorder')
  reorderItems(@Body() dto: ReorderDto) {
    return this.checklistService.reorderItems(dto);
  }

  // --- Public / Existing ---

  // PUBLIC - Digunakan di form check-in
  @Get('by-category/:materialCategoryId')
  findByCategory(@Param('materialCategoryId') materialCategoryId: string) {
    return this.checklistService.findByCategory(+materialCategoryId);
  }
}
