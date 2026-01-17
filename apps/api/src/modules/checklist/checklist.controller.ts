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
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createChecklistDto: CreateChecklistDto) {
    return this.checklistService.create(createChecklistDto);
  }

  // PUBLIC - Digunakan di form check-in
  @Get()
  findAll() {
    return this.checklistService.findAll();
  }

  // PUBLIC - Digunakan di form check-in
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checklistService.findOne(+id);
  }

  // PUBLIC - Digunakan di form check-in
  @Get('by-category/:materialCategoryId')
  findByCategory(@Param('materialCategoryId') materialCategoryId: string) {
    return this.checklistService.findByCategory(+materialCategoryId);
  }

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChecklistDto: UpdateChecklistDto,
  ) {
    return this.checklistService.update(+id, updateChecklistDto);
  }

  // PROTECTED - Admin only
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checklistService.remove(+id);
  }
}
