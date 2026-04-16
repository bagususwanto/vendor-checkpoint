import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDelayReasonDto } from './dto/create-delay-reason.dto';
import { UpdateDelayReasonDto } from './dto/update-delay-reason.dto';

@Injectable()
export class DelayReasonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateDelayReasonDto) {
    return this.prisma.mst_delay_reason.create({
      data: createDto,
    });
  }

  async findAll(category?: string) {
    return this.prisma.mst_delay_reason.findMany({
      where: category ? { category } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const reason = await this.prisma.mst_delay_reason.findUnique({
      where: { delay_reason_id: id },
    });
    if (!reason) throw new NotFoundException('Delay reason not found');
    return reason;
  }

  async update(id: number, updateDto: UpdateDelayReasonDto) {
    await this.findOne(id);
    return this.prisma.mst_delay_reason.update({
      where: { delay_reason_id: id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Soft delete logic can be applied if needed
    return this.prisma.mst_delay_reason.delete({
      where: { delay_reason_id: id },
    });
  }
}
