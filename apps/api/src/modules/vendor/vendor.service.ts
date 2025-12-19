import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { HttpService } from '@nestjs/axios';
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

  async findAll(page = 1, limit = 20): Promise<PaginatedResponse<mst_vendor>> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.mst_vendor.findMany({
          skip,
          take: limit,
          where: {
            is_active: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.mst_vendor.count({
          where: {
            is_active: true,
          },
        }),
      ]);

      if (!data) {
        throw new NotFoundException('No vendor data found');
      }

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
    } catch (error) {
      // Prisma error, DB error, atau hidup lagi sial
      throw new InternalServerErrorException('Failed to fetch vendor data');
    }
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
