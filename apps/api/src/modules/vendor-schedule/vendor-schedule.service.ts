import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { PaginatedResponse } from '@repo/types';
import { Prisma } from 'generated/prisma/client';
import * as ExcelJS from 'exceljs';

@Injectable()
export class VendorScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateVendorScheduleDto) {
    return this.prisma.mst_vendor_schedule.create({
      data: createDto,
      include: { vendor: true },
    });
  }

  async findAll(
    query: PaginatedParamsDto,
    vendor_id?: number,
    day_of_week?: number,
  ): Promise<PaginatedResponse<any>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.mst_vendor_scheduleWhereInput = {
      vendor_id: vendor_id ?? undefined,
      day_of_week: day_of_week ?? undefined,
    };

    if (search?.trim()) {
      where.vendor = {
        OR: [
          { company_name: { contains: search } },
          { vendor_code: { contains: search } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.mst_vendor_schedule.findMany({
        skip,
        take: limit,
        where,
        include: { vendor: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.mst_vendor_schedule.count({ where }),
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
      include: { vendor: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mst_vendor_schedule.delete({
      where: { schedule_id: id },
    });
  }

  async downloadTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Template Jadwal');

    // Define columns
    sheet.columns = [
      { header: 'Vendor Code', key: 'vendor_code', width: 20 },
      { header: 'Day Of Week (1-7)', key: 'day_of_week', width: 20 },
      { header: 'Rit', key: 'rit', width: 10 },
      { header: 'Arrival Time (HH:mm)', key: 'arrival_time', width: 20 },
      { header: 'Departure Time (HH:mm)', key: 'departure_time', width: 20 },
      { header: 'Truck Station', key: 'truck_station', width: 20 },
    ];

    // Style the header
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };
      cell.border = {
        bottom: { style: 'thin' },
      };
    });

    // Add note/guide about day of week
    sheet.getCell('G1').value = 'PANDUAN HARI:';
    sheet.getCell('G1').font = { bold: true };
    sheet.getCell('H1').value = '1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat, 6=Sabtu, 7=Minggu';

    // Add a sample row (optional)
    sheet.addRow({
      vendor_code: 'VND001',
      day_of_week: 1,
      rit: 1,
      arrival_time: '08:00',
      departure_time: '10:00',
      truck_station: 'DOCK-1',
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
