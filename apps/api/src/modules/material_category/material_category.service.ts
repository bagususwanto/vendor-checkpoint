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

    // Check usage
    const [checkinCount, checklistItemCount] = await Promise.all([
      this.prisma.ops_checkin_entry.count({
        where: { material_category_id: id },
      }),
      this.prisma.mst_checklist_item.count({
        where: { material_category_id: id },
      }),
    ]);

    // If used in any transaction or configuration, soft delete
    if (checkinCount > 0 || checklistItemCount > 0) {
      return this.prisma.mst_material_category.update({
        where: { material_category_id: id },
        data: { is_active: false },
      });
    }

    // Otherwise, hard delete
    return this.prisma.mst_material_category.delete({
      where: { material_category_id: id },
    });
  }

  async bulkDelete(
    bulkDeleteDto: BulkDeleteMaterialCategoryDto,
  ): Promise<{ count: number }> {
    const { ids } = bulkDeleteDto;

    if (!ids || ids.length === 0) {
      throw new BadRequestException('Tidak ada ID yang dipilih');
    }

    // Check usage to determine which can be hard deleted vs soft deleted
    const [usedInCheckin, usedInChecklist] = await Promise.all([
      this.prisma.ops_checkin_entry.findMany({
        where: { material_category_id: { in: ids } },
        select: { material_category_id: true },
        distinct: ['material_category_id'],
      }),
      this.prisma.mst_checklist_item.findMany({
        where: { material_category_id: { in: ids } },
        select: { material_category_id: true },
        distinct: ['material_category_id'],
      }),
    ]);

    const usedIds = new Set<number>([
      ...usedInCheckin.map((item) => item.material_category_id),
      ...usedInChecklist
        .filter((item) => item.material_category_id !== null)
        .map((item) => item.material_category_id as number),
    ]);

    const idsToSoftDelete = ids.filter((id) => usedIds.has(id));
    const idsToHardDelete = ids.filter((id) => !usedIds.has(id));

    let softDeletedCount = 0;
    let hardDeletedCount = 0;

    if (idsToSoftDelete.length > 0) {
      const res = await this.prisma.mst_material_category.updateMany({
        where: { material_category_id: { in: idsToSoftDelete } },
        data: { is_active: false },
      });
      softDeletedCount = res.count;
    }

    if (idsToHardDelete.length > 0) {
      const res = await this.prisma.mst_material_category.deleteMany({
        where: { material_category_id: { in: idsToHardDelete } },
      });
      hardDeletedCount = res.count;
    }

    return { count: softDeletedCount + hardDeletedCount };
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

  async getSelection(): Promise<mst_material_category[]> {
    return this.prisma.mst_material_category.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        category_name: 'asc',
      },
    });
  }
}
