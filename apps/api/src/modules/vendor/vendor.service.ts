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
import * as https from 'https';

// Agent untuk bypass validasi SSL (mengatasi error "unable to verify the first certificate")
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

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

    if (query.categoryId) {
      where.vendor_category_id = query.categoryId;
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
        include: { vendor_category: true },
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

  async syncFromExternalApi(token: string): Promise<SyncResult> {
    try {
      const resp$ = this.httpService.get(
        `${process.env.EXTERNAL_API_URL}/supplier-public`,
        {
          httpsAgent,
          headers: {
            Authorization: token,
          },
        },
      );
      const { data } = await lastValueFrom(resp$);

      const externalVendors: ExternalVendor[] = Array.isArray(data)
        ? data
        : data.data || [];

      if (externalVendors.length === 0) {
        console.log('No vendors to sync');
        return {
          data: {
            created: 0,
            updated: 0,
            total: 0,
            syncTime: new Date(),
          },
        };
      }

      const syncTime = new Date();
      const vendorCodes = externalVendors
        .map((v) => v.supplierCode)
        .filter(Boolean);

      // Get existing records BEFORE sync to accurately count created vs updated
      const existingVendors = await this.prisma.mst_vendor.findMany({
        where: {
          vendor_code: { in: vendorCodes },
        },
        select: { vendor_code: true },
      });
      const existingCodesSet = new Set(
        existingVendors.map((v) => v.vendor_code),
      );

      let created = 0;
      let updated = 0;

      // Create upsert operations
      const operations: any[] = [];

      for (const vendor of externalVendors) {
        if (!vendor.supplierCode) {
          console.warn('Skipping vendor without code:', vendor);
          continue;
        }

        const vendorCode = vendor.supplierCode;
        const companyName = vendor.supplierName;
        const isActive = vendor.flag === 1;

        // Count before adding to operations
        if (existingCodesSet.has(vendorCode)) {
          updated++;
        } else {
          created++;
        }

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

      // Execute in smaller batches to avoid MSSQL limits and prevent final batch errors
      const BATCH_SIZE = 20; // Reduced from 50 for safety with large datasets
      const batchErrors: { batchIndex: number; error: any }[] = [];

      console.log(
        `Syncing ${operations.length} vendors (${created} new, ${updated} updates) in batches of ${BATCH_SIZE}...`,
      );

      for (let i = 0; i < operations.length; i += BATCH_SIZE) {
        const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(operations.length / BATCH_SIZE);
        const chunk = operations.slice(i, i + BATCH_SIZE);

        console.log(
          `Processing batch ${batchIndex} of ${totalBatches} (${chunk.length} items)...`,
        );

        try {
          await Promise.all(chunk);
          console.log(`✓ Batch ${batchIndex} completed successfully`);
        } catch (error) {
          console.error(
            `✗ Batch ${batchIndex} failed:`,
            error instanceof Error ? error.message : error,
          );
          batchErrors.push({ batchIndex, error });
          // Continue with next batch instead of stopping
        }
      }

      if (batchErrors.length > 0) {
        console.warn(
          `Sync completed with ${batchErrors.length} batch(es) failed`,
        );
        console.warn(
          'Failed batches:',
          batchErrors.map((b) => b.batchIndex),
        );
      }

      console.log(
        `Sync completed: ${created} created, ${updated} updated, total ${externalVendors.length}`,
      );

      return {
        data: {
          created,
          updated,
          total: externalVendors.length,
          syncTime,
        },
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
