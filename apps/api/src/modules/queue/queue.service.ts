import { Injectable } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { getStartOfToday } from 'src/common/utils/today-date.util';

@Injectable()
export class QueueService {
  create(createQueueDto: CreateQueueDto) {
    return 'This action adds a new queue';
  }

  async createQueueStatus(tx: any, entryId: number, queueNumber: string) {
    const startOfToday = getStartOfToday();
    const lastPriority = await tx.ops_queue_status.findFirst({
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

    await tx.ops_queue_status.create({
      data: {
        entry_id: entryId,
        queue_number: queueNumber,
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
