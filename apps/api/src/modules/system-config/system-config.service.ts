import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { FindSystemConfigParamsDto } from './dto/find-system-config-params.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginatedResponse } from '@repo/types';
import { cfg_system, Prisma } from 'generated/prisma/client';

@Injectable()
export class SystemConfigService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    query: FindSystemConfigParamsDto,
  ): Promise<PaginatedResponse<cfg_system>> {
    const { page, limit, search, config_type } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.cfg_systemWhereInput = {};

    // Filter by config_type
    if (config_type) {
      where.config_type = config_type;
    }

    // Search filter
    if (search?.trim()) {
      where.OR = [
        { config_key: { contains: search } },
        { config_value: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.cfg_system.findMany({
        skip,
        take: limit,
        where,
        orderBy: { config_key: 'asc' },
        include: {
          user: {
            select: {
              user_id: true,
              username: true,
              full_name: true,
            },
          },
        },
      }),
      this.prisma.cfg_system.count({ where }),
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

  async findOne(id: number): Promise<cfg_system | null> {
    const config = await this.prisma.cfg_system.findUnique({
      where: {
        config_id: id,
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            full_name: true,
          },
        },
      },
    });

    if (!config) {
      throw new NotFoundException('Konfigurasi sistem tidak ditemukan');
    }

    return config;
  }

  async findByConfigKey(config_key: string): Promise<cfg_system | null> {
    return this.prisma.cfg_system.findUnique({
      where: {
        config_key: config_key,
      },
    });
  }

  async update(
    id: number,
    updateSystemConfigDto: UpdateSystemConfigDto,
  ): Promise<{ old_value: cfg_system; new_value: cfg_system }> {
    // Check if exists and get old value
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Konfigurasi sistem tidak ditemukan');
    }

    // Check if editable
    if (!existing.is_editable) {
      throw new BadRequestException(
        'Konfigurasi sistem ini tidak dapat diubah',
      );
    }

    const updated = await this.prisma.cfg_system.update({
      where: { config_id: id },
      data: updateSystemConfigDto,
    });

    return {
      old_value: existing,
      new_value: updated,
    };
  }
}
