import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { getStartOfToday } from 'src/common/utils/today-date.util';

@Injectable()
export class QueueService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tx: any, createQueueDto: CreateQueueDto) {
    const prismaClient = tx || this.prisma;
    const startOfToday = getStartOfToday();
    const lastPriority = await prismaClient.ops_queue_status.findFirst({
      where: {
        last_updated: {
          gte: startOfToday,
        },
      },
      orderBy: {
        last_updated: 'desc',
      },
      select: {
        priority_order: true,
      },
    });

    const lastPrioritySeq = lastPriority ? lastPriority.priority_order : 0;
    const nextPriority = lastPrioritySeq + 1;

    return await prismaClient.ops_queue_status.create({
      data: {
        entry_id: createQueueDto.entry_id,
        queue_number: createQueueDto.queue_number,
        current_status: 'MENUNGGU',
        status_display_text: 'Menunggu Verifikasi',
        priority_order: nextPriority,
      },
    });
  }

  findAll() {
    return `This action returns all queue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} queue`;
  }

  update(id: number, updateQueueDto: UpdateQueueDto) {
    return `This action updates a #${id} queue`;
  }

  remove(id: number) {
    return `This action removes a #${id} queue`;
  }
}
