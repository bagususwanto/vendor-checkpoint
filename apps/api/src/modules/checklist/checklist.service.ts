import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VendorCategoryService } from '../vendor-category/vendor-category.service';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorCategoryService: VendorCategoryService,
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

  async findByCategory(vendorCategoryId: number) {
    // validate vendorCategoryId
    if (!vendorCategoryId) {
      throw new BadRequestException('vendorCategoryId is required');
    }
    const vendorCategory =
      await this.vendorCategoryService.findOne(vendorCategoryId);
    if (!vendorCategory) {
      throw new BadRequestException('Invalid vendorCategoryId');
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
            vendor_category_id: true,
            is_required: true,
            display_order: true,
          },
          where: {
            is_active: true,
            OR: [
              { vendor_category_id: vendorCategoryId }, // item khusus vendor
              { vendor_category_id: null }, // item umum
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
