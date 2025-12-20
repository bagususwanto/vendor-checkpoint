import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { mst_vendor } from 'generated/prisma/client';
import { PaginatedResponse } from '@repo/types';

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
    page = 1,
    limit = 10,
    search?: string,
    isActive?: boolean,
    categoryId?: number,
  ): Promise<PaginatedResponse<mst_vendor>> {
    page = Math.max(1, page);
    limit = Math.min(Math.max(1, limit), 100);
    const skip = (page - 1) * limit;

    const where = {
      ...(typeof isActive === 'boolean' && {
        is_active: isActive,
      }),
      ...(search && {
        OR: [
          { company_name: { contains: search } },
          { vendor_code: { contains: search } },
        ],
      }),
      ...(categoryId && {
        vendor_category_id: categoryId,
      }),
    };

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
      success: true,
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
    return `This action returns a #${id} vendor`;
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
