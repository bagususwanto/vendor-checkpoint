import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';

@Injectable()
export class VendorScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateVendorScheduleDto) {
    return this.prisma.mst_vendor_schedule.create({
      data: createDto,
    });
  }

  async findAll(vendor_id?: number, day_of_week?: number) {
    return this.prisma.mst_vendor_schedule.findMany({
      where: {
        vendor_id: vendor_id ? vendor_id : undefined,
        day_of_week: day_of_week ? day_of_week : undefined,
      },
      include: {
        vendor: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const schedule = await this.prisma.mst_vendor_schedule.findUnique({
      where: { schedule_id: id },
      include: { vendor: true },
    });
    if (!schedule) throw new NotFoundException('Vendor Schedule not found');
    return schedule;
  }

  async update(id: number, updateDto: UpdateVendorScheduleDto) {
    await this.findOne(id);
    return this.prisma.mst_vendor_schedule.update({
      where: { schedule_id: id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mst_vendor_schedule.delete({
      where: { schedule_id: id },
    });
  }
}
