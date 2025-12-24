import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginatedResponse } from '@repo/types';
import { FindVendorParamsDto } from './dto/find-vendor-params.dto';
import { mst_vendor } from 'generated/prisma/client';

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService) {}

  create(createVendorDto: CreateVendorDto) {
    return 'This action adds a new vendor';
  }

  // async findAll() {
  //   try {
  //     const resp$ = this.httpService.get(
  //       `${process.env.EXTERNAL_API_URL}/supplier-public`,
  //     );
  //     const { data } = await lastValueFrom(resp$);
  //     return data;
  //   } catch (err) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  // }

  async findAll(
    query: FindVendorParamsDto,
  ): Promise<PaginatedResponse<mst_vendor>> {
    const { page, limit, search, isActive } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (typeof isActive === 'boolean') {
      where.is_active = isActive;
    }

    if (search?.trim()) {
      where.OR = [
        { company_name: { contains: search } },
        { vendor_code: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.mst_vendor.findMany({
        skip,
        take: limit,
        where,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.mst_vendor.count({ where }),
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
    return this.prisma.mst_vendor.findUnique({
      where: {
        vendor_id: id,
      },
    });
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
