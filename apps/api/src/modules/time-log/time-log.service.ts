import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';

@Injectable()
export class TimeLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tx: any, createTimeLogDto: CreateTimeLogDto) {
    const prismaClient = tx || this.prisma;

    return await prismaClient.ops_timelog.create({
      data: {
        entry_id: createTimeLogDto.entry_id,
        checkin_time: new Date(),
        is_checked_out: false,
        estimated_wait_minutes: 30,
      },
    });
  }

  findAll() {
    return `This action returns all timeLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeLog`;
  }

  update(id: number, updateTimeLogDto: UpdateTimeLogDto) {
    return `This action updates a #${id} timeLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeLog`;
  }
}
