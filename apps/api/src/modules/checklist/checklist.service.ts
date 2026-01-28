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
    const categories = await this.prisma.mst_checklist_category.findMany({
      include: {
        mst_checklist_item: {
          include: {
            material_category: {
              select: {
                category_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        display_order: 'asc',
      },
    });

    return categories.map((category) => {
      const sortedItems = category.mst_checklist_item.sort((a, b) => {
        const typeA = a.item_type?.toLowerCase();
        const typeB = b.item_type?.toLowerCase();

        // Primary sort: item_type ('umum' first, 'khusus' last)
        if (typeA === 'umum' && typeB !== 'umum') {
          return -1;
        }
        if (typeA !== 'umum' && typeB === 'umum') {
          return 1;
        }

        // Secondary sort: display_order
        return a.display_order - b.display_order;
      });

      return {
        ...category,
        mst_checklist_item: sortedItems,
      };
    });
  }

  async updateCategory(id: number, dto: UpdateChecklistCategoryDto) {
    return this.prisma.mst_checklist_category.update({
      where: { checklist_category_id: id },
      data: dto,
    });
  }

  async deleteCategory(id: number) {
    // Check usage in transactions
    const usedCount = await this.prisma.ops_checkin_response.count({
      where: { checklist_category_id: id },
    });

    if (usedCount > 0) {
      // Soft delete if used
      return this.prisma.mst_checklist_category.update({
        where: { checklist_category_id: id },
        data: { is_active: false },
      });
    }

    // Hard delete if not used (cascade delete items first)
    return this.prisma.$transaction(async (tx) => {
      await tx.mst_checklist_item.deleteMany({
        where: { checklist_category_id: id },
      });
      return tx.mst_checklist_category.delete({
        where: { checklist_category_id: id },
      });
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
    // Check usage in transactions
    const usedCount = await this.prisma.ops_checkin_response.count({
      where: { checklist_item_id: id },
    });

    if (usedCount > 0) {
      // Soft delete if used
      return this.prisma.mst_checklist_item.update({
        where: { checklist_item_id: id },
        data: { is_active: false },
      });
    }

    // Hard delete if not used
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
