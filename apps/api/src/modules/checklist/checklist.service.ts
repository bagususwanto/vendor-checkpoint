import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistCategoryDto } from './dto/create-category.dto';
import { UpdateChecklistCategoryDto } from './dto/update-category.dto';
import { CreateChecklistItemDto } from './dto/create-item.dto';
import { UpdateChecklistItemDto } from './dto/update-item.dto';
import { ReorderDto } from './dto/reorder.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MaterialCategoryService } from '../material_category/material_category.service';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly materialCategoryService: MaterialCategoryService,
  ) {}

  // --- Category ---

  async createCategory(dto: CreateChecklistCategoryDto) {
    return this.prisma.mst_checklist_category.create({
      data: dto,
    });
  }

  async findAllCategories() {
    return this.prisma.mst_checklist_category.findMany({
      include: {
        mst_checklist_item: {
          orderBy: {
            display_order: 'asc',
          },
        },
      },
      orderBy: {
        display_order: 'asc',
      },
    });
  }

  async updateCategory(id: number, dto: UpdateChecklistCategoryDto) {
    return this.prisma.mst_checklist_category.update({
      where: { checklist_category_id: id },
      data: dto,
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.mst_checklist_category.delete({
      where: { checklist_category_id: id },
    });
  }

  async reorderCategories(dto: ReorderDto) {
    const transaction = dto.items.map((item) =>
      this.prisma.mst_checklist_category.update({
        where: { checklist_category_id: item.id },
        data: { display_order: item.display_order },
      }),
    );
    return this.prisma.$transaction(transaction);
  }

  // --- Item ---

  async createItem(dto: CreateChecklistItemDto) {
    return this.prisma.mst_checklist_item.create({
      data: dto,
    });
  }

  async updateItem(id: number, dto: UpdateChecklistItemDto) {
    return this.prisma.mst_checklist_item.update({
      where: { checklist_item_id: id },
      data: dto,
    });
  }

  async deleteItem(id: number) {
    return this.prisma.mst_checklist_item.delete({
      where: { checklist_item_id: id },
    });
  }

  async reorderItems(dto: ReorderDto) {
    const transaction = dto.items.map((item) =>
      this.prisma.mst_checklist_item.update({
        where: { checklist_item_id: item.id },
        data: { display_order: item.display_order },
      }),
    );
    return this.prisma.$transaction(transaction);
  }

  // --- External / Public ---

  findManyByIds(ids: number[]) {
    return this.prisma.mst_checklist_item.findMany({
      where: {
        checklist_item_id: {
          in: ids,
        },
      },
    });
  }

  async findByCategory(materialCategoryId: number) {
    // validate materialCategoryId
    if (!materialCategoryId) {
      throw new BadRequestException('Material Category is required');
    }
    const vendorCategory =
      await this.materialCategoryService.findOne(materialCategoryId);
    if (!vendorCategory) {
      throw new BadRequestException('Invalid materialCategoryId');
    }

    return this.prisma.mst_checklist_category.findMany({
      select: {
        checklist_category_id: true,
        category_name: true,
        display_order: true,
        icon_name: true,
        color_code: true,
        mst_checklist_item: {
          select: {
            checklist_item_id: true,
            item_type: true,
            item_text: true,
            material_category_id: true,
            is_required: true,
            display_order: true,
          },
          where: {
            is_active: true,
            OR: [
              { material_category_id: materialCategoryId }, // item khusus vendor
              { material_category_id: null }, // item umum
            ],
          },
          orderBy: {
            display_order: 'asc',
          },
        },
      },
      where: {
        is_active: true,
      },
      orderBy: {
        display_order: 'asc',
      },
    });
  }
}
