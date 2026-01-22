import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginatedResponse, SyncResult } from '@repo/types';
import { FindVendorParamsDto } from './dto/find-vendor-params.dto';
import { mst_vendor } from 'generated/prisma/client';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

interface ExternalVendor {
  vendor_code: string;
  company_name: string;
  is_active?: boolean;
}

@Injectable()
export class VendorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

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

  async findOne(id: number): Promise<mst_vendor> {
    const vendor = await this.prisma.mst_vendor.findUnique({
      where: { vendor_id: id },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async update(
    id: number,
    updateVendorDto: UpdateVendorDto,
  ): Promise<mst_vendor> {
    // Check if vendor exists
    await this.findOne(id);

    return this.prisma.mst_vendor.update({
      where: { vendor_id: id },
      data: {
        ...updateVendorDto,
        updated_at: new Date(),
      },
    });
  }

  async toggleActive(id: number): Promise<mst_vendor> {
    const vendor = await this.findOne(id);

    return this.prisma.mst_vendor.update({
      where: { vendor_id: id },
      data: {
        is_active: !vendor.is_active,
        updated_at: new Date(),
      },
    });
  }

  async syncFromExternalApi(): Promise<SyncResult> {
    try {
      const resp$ = this.httpService.get(
        `${process.env.EXTERNAL_API_URL}/supplier-public`,
      );
      const { data } = await lastValueFrom(resp$);

      const externalVendors: ExternalVendor[] = Array.isArray(data)
        ? data
        : data.data || [];

      let created = 0;
      let updated = 0;
      const syncTime = new Date();

      for (const vendor of externalVendors) {
        const existingVendor = await this.prisma.mst_vendor.findUnique({
          where: { vendor_code: vendor.vendor_code },
        });

        if (existingVendor) {
          // Update existing vendor
          await this.prisma.mst_vendor.update({
            where: { vendor_id: existingVendor.vendor_id },
            data: {
              company_name: vendor.company_name,
              is_active: vendor.is_active ?? existingVendor.is_active,
              last_sync_time: syncTime,
              sync_source: 'EXTERNAL_API',
              updated_at: syncTime,
            },
          });
          updated++;
        } else {
          // Create new vendor
          await this.prisma.mst_vendor.create({
            data: {
              vendor_code: vendor.vendor_code,
              company_name: vendor.company_name,
              is_active: vendor.is_active ?? true,
              last_sync_time: syncTime,
              sync_source: 'EXTERNAL_API',
            },
          });
          created++;
        }
      }

      return {
        created,
        updated,
        total: externalVendors.length,
        syncTime,
      };
    } catch (err: any) {
      console.error('Sync error:', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      throw new InternalServerErrorException(
        'Failed to sync vendors from external API',
      );
    }
  }
}
