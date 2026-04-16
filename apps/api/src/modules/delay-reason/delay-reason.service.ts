import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDelayReasonDto } from './dto/create-delay-reason.dto';
import { UpdateDelayReasonDto } from './dto/update-delay-reason.dto';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { PaginatedResponse } from '@repo/types';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class DelayReasonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateDelayReasonDto) {
    return this.prisma.mst_delay_reason.create({
      data: createDto,
    });
  }

  async findAll(
    query: PaginatedParamsDto,
    category?: string,
  ): Promise<PaginatedResponse<any>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.mst_delay_reasonWhereInput = {
      category: category ?? undefined,
    };

    if (search?.trim()) {
      where.reason_text = { contains: search };
    }

    const [data, total] = await Promise.all([
      this.prisma.mst_delay_reason.findMany({
        skip,
        take: limit,
        where,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.mst_delay_reason.count({ where }),
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

  async findOne(id: number) {
    const reason = await this.prisma.mst_delay_reason.findUnique({
      where: { delay_reason_id: id },
    });
    if (!reason) throw new NotFoundException('Delay reason not found');
    return reason;
  }

  async update(id: number, updateDto: UpdateDelayReasonDto) {
    await this.findOne(id);
    return this.prisma.mst_delay_reason.update({
      where: { delay_reason_id: id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mst_delay_reason.delete({
      where: { delay_reason_id: id },
    });
  }
}
