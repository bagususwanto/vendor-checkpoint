import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginatedResponse, SyncResult } from '@repo/types';
import { FindVendorParamsDto } from './dto/find-vendor-params.dto';
import { mst_vendor } from 'generated/prisma/client';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

interface ExternalVendor {
  supplierCode: string; // Mapped to vendor_code
  supplierName: string; // Mapped to company_name
  flag?: number; // Maybe mapped to is_active? assuming 1 is active
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

      // Optimize: Create a map of operations
      const operations: any[] = [];

      for (const vendor of externalVendors) {
        if (!vendor.supplierCode) {
          console.warn('Skipping vendor without code:', vendor);
          continue;
        }

        const vendorCode = vendor.supplierCode;
        const companyName = vendor.supplierName;
        const isActive = vendor.flag === 1;

        // Use upsert to handle both create and update in one operation per vendor
        // This is safe but still 1 query per vendor.
        // To truly optimize, we can use transaction.
        operations.push(
          this.prisma.mst_vendor.upsert({
            where: { vendor_code: vendorCode },
            update: {
              company_name: companyName,
              is_active: isActive,
              last_sync_time: syncTime,
              sync_source: 'EXTERNAL_API',
              updated_at: syncTime,
            },
            create: {
              vendor_code: vendorCode,
              company_name: companyName,
              is_active: isActive,
              last_sync_time: syncTime,
              sync_source: 'EXTERNAL_API',
            },
          }),
        );
      }

      // Execute in batches to avoid MSSQL transaction limits/timeouts
      const BATCH_SIZE = 50;
      const chunks = [];

      for (let i = 0; i < operations.length; i += BATCH_SIZE) {
        chunks.push(operations.slice(i, i + BATCH_SIZE));
      }

      console.log(
        `Syncing ${operations.length} vendors in ${chunks.length} batches...`,
      );

      for (const [index, chunk] of chunks.entries()) {
        console.log(`Processing batch ${index + 1} of ${chunks.length}...`);
        try {
          // Use Promise.all to run in parallel without transaction overhead
          // This prevents the 'EREQINPROG' rollback error in MSSQL
          await Promise.all(chunk);
        } catch (e) {
          console.error(`Failed to sync batch ${index + 1}:`, e);
          // We continue to try next batches
          continue;
        }
      }

      const existingCodes = await this.prisma.mst_vendor.findMany({
        select: { vendor_code: true },
        where: {
          vendor_code: {
            in: externalVendors.map((v) => v.supplierCode).filter(Boolean),
          },
        },
      });
      const existingCodeSet = new Set(existingCodes.map((v) => v.vendor_code));

      created = 0;
      updated = 0;

      // Re-loop to count (cheap in memory)
      externalVendors.forEach((v) => {
        if (!v.supplierCode) return;
        if (existingCodeSet.has(v.supplierCode)) {
          updated++;
        } else {
          created++;
        }
      });

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
