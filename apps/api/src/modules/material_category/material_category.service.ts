import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMaterialCategoryDto } from './dto/create-material_category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material_category.dto';
import { BulkDeleteMaterialCategoryDto } from './dto/bulk-delete-material_category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { PaginatedResponse } from '@repo/types';
import { mst_material_category } from 'generated/prisma/client';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class MaterialCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createMaterialCategoryDto: CreateMaterialCategoryDto,
  ): Promise<mst_material_category> {
    try {
      return await this.prisma.mst_material_category.create({
        data: createMaterialCategoryDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('category_code')) {
          throw new ConflictException('Kode kategori sudah digunakan');
        }
        if (target.includes('category_name')) {
          throw new ConflictException('Nama kategori sudah digunakan');
        }
        throw new ConflictException('Data kategori sudah ada');
      }
      throw error;
    }
  }

  async findAll(
    query: PaginatedParamsDto,
  ): Promise<PaginatedResponse<mst_material_category>> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.mst_material_categoryWhereInput = {};

    // Filter by status
    const status = (query as any).status || 'all';
    if (status === 'active') {
      where.is_active = true;
    } else if (status === 'inactive') {
      where.is_active = false;
    }
    // 'all' means no filter on is_active

    // Search filter
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

  async findOne(id: number): Promise<mst_material_category | null> {
    return this.prisma.mst_material_category.findUnique({
      where: {
        material_category_id: id,
      },
    });
  }

  async update(
    id: number,
    updateMaterialCategoryDto: UpdateMaterialCategoryDto,
  ): Promise<mst_material_category> {
    // Check if exists
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Kategori material tidak ditemukan');
    }

    try {
      return await this.prisma.mst_material_category.update({
        where: { material_category_id: id },
        data: updateMaterialCategoryDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('category_code')) {
          throw new ConflictException('Kode kategori sudah digunakan');
        }
        if (target.includes('category_name')) {
          throw new ConflictException('Nama kategori sudah digunakan');
        }
        throw new ConflictException('Data kategori sudah ada');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<mst_material_category> {
    // Check if exists
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Kategori material tidak ditemukan');
    }

    // Soft delete by setting is_active to false
    return this.prisma.mst_material_category.update({
      where: { material_category_id: id },
      data: { is_active: false },
    });
  }

  async bulkDelete(
    bulkDeleteDto: BulkDeleteMaterialCategoryDto,
  ): Promise<{ count: number }> {
    const { ids } = bulkDeleteDto;

    if (!ids || ids.length === 0) {
      throw new BadRequestException('Tidak ada ID yang dipilih');
    }

    // Soft delete by setting is_active to false
    const result = await this.prisma.mst_material_category.updateMany({
      where: {
        material_category_id: {
          in: ids,
        },
      },
      data: {
        is_active: false,
      },
    });

    return { count: result.count };
  }

  async toggleStatus(id: number): Promise<mst_material_category> {
    // Check if exists
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Kategori material tidak ditemukan');
    }

    // Toggle is_active
    return this.prisma.mst_material_category.update({
      where: { material_category_id: id },
      data: { is_active: !existing.is_active },
    });
  }
}
