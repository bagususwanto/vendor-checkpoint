import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { AdjustmentFilterDto } from './dto/adjustment-filter.dto';
import { PaginatedResponse, PerformanceAdjustment, UserRole } from '@repo/types';

@Injectable()
export class PerformanceAdjustmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAdjustmentDto, userId: number): Promise<PerformanceAdjustment> {
    const localUserId = await this.resolveLocalUser(userId);

    // 1. Validate that at least one adjustment field is provided
    const hasAdjustment = 
      dto.adjusted_arrival_status !== undefined ||
      dto.adjusted_ai_safety_status !== undefined ||
      dto.adjusted_ppe_compliant !== undefined ||
      dto.adjusted_departure_status !== undefined ||
      dto.override_has_non_compliant !== undefined;

    if (!hasAdjustment) {
      throw new BadRequestException('Minimal satu field adjustment harus diisi');
    }

    // 2. Find the entry and current values
    const entry = await this.prisma.ops_checkin_entry.findUnique({
      where: { entry_id: dto.entry_id },
      include: {
        ops_timelog: true,
        ops_ppe_scan: true,
      },
    });

    if (!entry) {
      throw new NotFoundException('Data check-in tidak ditemukan');
    }

    // 3. Prepare original values
    const original_arrival_status = entry.arrival_status;
    const original_ai_safety_status = entry.ai_safety_status;
    const original_ppe_compliant = entry.ops_ppe_scan?.is_compliant ?? null;
    const original_departure_status = entry.ops_timelog?.departure_status ?? null;

    // 4. Create the adjustment
    const adjustment = await this.prisma.ops_performance_adjustment.create({
      data: {
        entry_id: dto.entry_id,
        adjusted_by_user_id: localUserId,
        original_arrival_status,
        adjusted_arrival_status: dto.adjusted_arrival_status ?? null,
        original_ai_safety_status,
        adjusted_ai_safety_status: dto.adjusted_ai_safety_status ?? null,
        original_ppe_compliant,
        adjusted_ppe_compliant: dto.adjusted_ppe_compliant ?? null,
        original_departure_status,
        adjusted_departure_status: dto.adjusted_departure_status ?? null,
        override_has_non_compliant: dto.override_has_non_compliant ?? null,
        adjustment_reason: dto.adjustment_reason,
      },
      include: {
        adjusted_by_user: {
          select: { full_name: true },
        },
        entry: {
          select: {
            queue_number: true,
            snapshot_company_name: true,
            driver_name: true,
          },
        },
      },
    });

    return adjustment as unknown as PerformanceAdjustment;
  }

  async findAll(filter: AdjustmentFilterDto): Promise<PaginatedResponse<PerformanceAdjustment>> {
    const { page = 1, limit = 10, vendorId, dateFrom, dateTo } = filter;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (vendorId) {
      where.entry = { vendor_id: vendorId };
    }

    if (dateFrom || dateTo) {
      where.created_at = {};
      if (dateFrom) where.created_at.gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        where.created_at.lte = end;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.ops_performance_adjustment.findMany({
        skip,
        take: limit,
        where,
        include: {
          adjusted_by_user: {
            select: { full_name: true },
          },
          entry: {
            select: {
              queue_number: true,
              snapshot_company_name: true,
              driver_name: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.ops_performance_adjustment.count({ where }),
    ]);

    return {
      data: data as unknown as PerformanceAdjustment[],
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<PerformanceAdjustment> {
    const adjustment = await this.prisma.ops_performance_adjustment.findUnique({
      where: { adjustment_id: id },
      include: {
        adjusted_by_user: {
          select: { full_name: true },
        },
        entry: {
          select: {
            queue_number: true,
            snapshot_company_name: true,
            driver_name: true,
          },
        },
      },
    });

    if (!adjustment) {
      throw new NotFoundException(`Adjustment with ID ${id} not found`);
    }

    return adjustment as unknown as PerformanceAdjustment;
  }

  async findByEntryId(entryId: number): Promise<PerformanceAdjustment | null> {
    const adjustment = await this.prisma.ops_performance_adjustment.findFirst({
      where: { entry_id: entryId },
      include: {
        adjusted_by_user: {
          select: { full_name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return adjustment as unknown as PerformanceAdjustment;
  }

  async remove(id: number, userId: number): Promise<void> {
    const localUserId = await this.resolveLocalUser(userId);
    const user = await this.prisma.mst_user.findUnique({ where: { user_id: localUserId } });
    
    const adjustment = await this.prisma.ops_performance_adjustment.findUnique({
      where: { adjustment_id: id },
    });

    if (!adjustment) {
      throw new NotFoundException(`Adjustment with ID ${id} not found`);
    }

    // Only creator or SUPER_ADMIN can delete
    if (adjustment.adjusted_by_user_id !== localUserId && user?.role !== UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Anda tidak memiliki izin untuk menghapus adjustment ini');
    }

    await this.prisma.ops_performance_adjustment.delete({
      where: { adjustment_id: id },
    });
  }

  private async resolveLocalUser(tokenUserId: number): Promise<number> {
    const userById = await this.prisma.mst_user.findUnique({
      where: { user_id: tokenUserId },
    });
    if (userById) return userById.user_id;

    const userByExternal = await this.prisma.mst_user.findUnique({
      where: { external_user_id: tokenUserId },
    });
    if (userByExternal) return userByExternal.user_id;

    throw new BadRequestException('User tidak ditemukan dalam database lokal');
  }
}
