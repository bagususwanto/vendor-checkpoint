import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { SyncResult } from '@repo/types';
import { mst_user } from 'generated/prisma/client';
import * as https from 'https';

// Agent untuk bypass validasi SSL (mengatasi error "unable to verify the first certificate")
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export interface ExternalUser {
  id: number;
  username: string;
  name: string; // or full_name
  Role: {
    roleName: string;
  };
}

@Injectable()
export class UserService {
  private lastSyncStatus: {
    inProgress: boolean;
    created: number;
    updated: number;
    total: number;
    syncTime?: Date;
    completedAt?: Date;
    error?: string;
  } = {
    inProgress: false,
    created: 0,
    updated: 0,
    total: 0,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<mst_user[]> {
    return this.prisma.mst_user.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number): Promise<mst_user> {
    const user = await this.prisma.mst_user.findUnique({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async syncFromExternalApi(token: string): Promise<SyncResult> {
    this.syncFromExternalApiAsync(token).catch((err) =>
      console.error('Background sync error:', err),
    );

    return {
      data: {
        message: 'Sync started in background',
        status: 'processing',
      },
    } as any;
  }

  private async syncFromExternalApiAsync(token: string): Promise<void> {
    if (this.lastSyncStatus.inProgress) {
      console.warn('Sync already in progress, skipping...');
      return;
    }

    this.lastSyncStatus.inProgress = true;
    this.lastSyncStatus.error = undefined;

    try {
      const resp$ = this.httpService.get(
        `${process.env.EXTERNAL_API_URL}/user-public`,
        {
          httpsAgent,
          headers: {
            Authorization: token,
          },
        },
      );
      const { data } = await lastValueFrom(resp$);

      const externalUsers: ExternalUser[] = Array.isArray(data)
        ? data
        : data.data || [];

      if (externalUsers.length === 0) {
        console.log('No users to sync');
        this.lastSyncStatus = {
          inProgress: false,
          created: 0,
          updated: 0,
          total: 0,
          completedAt: new Date(),
        };
        return;
      }

      const syncTime = new Date();
      const externalUserIds = externalUsers.map((u) => u.id).filter(Boolean);

      const existingUsers = await this.prisma.mst_user.findMany({
        where: {
          external_user_id: { in: externalUserIds },
        },
        select: { external_user_id: true },
      });
      const existingIdSet = new Set(
        existingUsers.map((u) => u.external_user_id),
      );

      let created = 0;
      let updated = 0;
      const operations: any[] = [];

      for (const user of externalUsers) {
        const userData = {
          username: user.username,
          full_name: user.name,
          role: user.Role.roleName,
          updated_at: syncTime,
        };

        if (existingIdSet.has(user.id)) {
          updated++;
        } else {
          created++;
        }

        operations.push(
          this.prisma.mst_user.upsert({
            where: { external_user_id: user.id },
            update: userData,
            create: {
              external_user_id: user.id,
              ...userData,
              created_at: syncTime,
            },
          }),
        );
      }

      const BATCH_SIZE = 20;
      const batchErrors: { batchIndex: number; error: any }[] = [];

      console.log(
        `Syncing ${operations.length} users (${created} new, ${updated} updates) in batches of ${BATCH_SIZE}...`,
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

      this.lastSyncStatus = {
        inProgress: false,
        created,
        updated,
        total: externalUsers.length,
        syncTime,
        completedAt: new Date(),
      };
    } catch (err: any) {
      console.error('Sync user error:', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      this.lastSyncStatus = {
        inProgress: false,
        created: 0,
        updated: 0,
        total: 0,
        error: err?.message || 'Failed to sync users from external API',
        completedAt: new Date(),
      };
    }
  }

  getSyncStatus() {
    return this.lastSyncStatus;
  }
}
