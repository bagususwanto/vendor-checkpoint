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
      // Assuming endpoint is /users or similar
      const resp$ = this.httpService.get(
        `${process.env.EXTERNAL_API_URL}/users`,
      );
      const { data } = await lastValueFrom(resp$);

      const externalUsers: ExternalUser[] = Array.isArray(data)
        ? data
        : data.data || [];

      let created = 0;
      let updated = 0;
      const syncTime = new Date();

      for (const user of externalUsers) {
        const existingUser = await this.prisma.mst_user.findUnique({
          where: { external_user_id: user.external_user_id },
        });

        const userData = {
          username: user.username,
          full_name: user.name, // Adjust based on actual external API field
          role: user.role, // Ensure roles match what DB expects
          is_active: user.is_active,
          updated_at: syncTime,
        };

        if (existingUser) {
          await this.prisma.mst_user.update({
            where: { user_id: existingUser.user_id },
            data: userData,
          });
          updated++;
        } else {
          await this.prisma.mst_user.create({
            data: {
              external_user_id: user.external_user_id,
              ...userData,
              created_at: syncTime,
            },
          });
          created++;
        }
      }

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
