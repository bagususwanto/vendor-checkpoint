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

export interface ExternalUser {
  external_user_id: string; // or id
  username: string;
  name: string; // or full_name
  role: string;
  is_active: boolean;
}

@Injectable()
export class UserService {
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

  async syncFromExternalApi(): Promise<SyncResult> {
    try {
      const resp$ = this.httpService.get(
        `${process.env.EXTERNAL_API_URL}/user-public`,
      );
      const { data } = await lastValueFrom(resp$);

      const externalUsers: ExternalUser[] = Array.isArray(data)
        ? data
        : data.data || [];

      let created = 0;
      let updated = 0;
      const syncTime = new Date();

      // Optimize: Create a map of operations
      const operations: any[] = [];

      for (const user of externalUsers) {
        if (!user.external_user_id) {
          console.warn('Skipping user without ID:', user);
          continue;
        }

        const userData = {
          username: user.username,
          full_name: user.name,
          role: user.role,
          is_active: user.is_active,
          updated_at: syncTime,
        };

        operations.push(
          this.prisma.mst_user.upsert({
            where: { external_user_id: user.external_user_id },
            update: userData,
            create: {
              external_user_id: user.external_user_id,
              ...userData,
              created_at: syncTime,
            },
          }),
        );
      }

      // Execute in batches
      const BATCH_SIZE = 50;
      const chunks = [];

      for (let i = 0; i < operations.length; i += BATCH_SIZE) {
        chunks.push(operations.slice(i, i + BATCH_SIZE));
      }

      console.log(
        `Syncing ${operations.length} users in ${chunks.length} batches...`,
      );

      for (const [index, chunk] of chunks.entries()) {
        console.log(`Processing batch ${index + 1} of ${chunks.length}...`);
        try {
          await Promise.all(chunk);
        } catch (e) {
          console.error(`Failed to sync batch ${index + 1}:`, e);
          continue;
        }
      }

      // Calculate stats
      const existingIds = await this.prisma.mst_user.findMany({
        select: { external_user_id: true },
        where: {
          external_user_id: {
            in: externalUsers.map((u) => u.external_user_id).filter(Boolean),
          },
        },
      });
      const existingIdSet = new Set(existingIds.map((u) => u.external_user_id));

      created = 0;
      updated = 0;

      externalUsers.forEach((u) => {
        if (!u.external_user_id) return;
        if (existingIdSet.has(u.external_user_id)) {
          updated++;
        } else {
          created++;
        }
      });

      return {
        created,
        updated,
        total: externalUsers.length,
        syncTime,
      };
    } catch (err: any) {
      console.error('Sync user error:', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      throw new InternalServerErrorException(
        'Failed to sync users from external API',
      );
    }
  }
}
