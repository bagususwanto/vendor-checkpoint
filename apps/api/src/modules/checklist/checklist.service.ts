import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MaterialCategoryService } from '../material_category/material_category.service';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly materialCategoryService: MaterialCategoryService,
  ) {}

  create(createChecklistDto: CreateChecklistDto) {
    return 'This action adds a new checklist';
  }

  findAll() {
    return `This action returns all checklist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checklist`;
  }

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

  update(id: number, updateChecklistDto: UpdateChecklistDto) {
    return `This action updates a #${id} checklist`;
  }

  remove(id: number) {
    return `This action removes a #${id} checklist`;
  }
}
