import { Injectable } from '@nestjs/common';
import { CreateMaterialCategoryDto } from './dto/create-material_category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material_category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { PaginatedResponse } from '@repo/types';
import { mst_material_category } from 'generated/prisma/client';

@Injectable()
export class MaterialCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMaterialCategoryDto: CreateMaterialCategoryDto) {
    return 'This action adds a new materialCategory';
  }

  async findAll(
    query: PaginatedParamsDto,
  ): Promise<PaginatedResponse<mst_material_category>> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        { category_name: { contains: search } },
        { category_code: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.mst_material_category.findMany({
        skip,
        take: limit,
        where,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.mst_material_category.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.prisma.mst_material_category.findUnique({
      where: {
        material_category_id: id,
      },
    });
  }

  update(id: number, updateMaterialCategoryDto: UpdateMaterialCategoryDto) {
    return `This action updates a #${id} materialCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialCategory`;
  }
}
