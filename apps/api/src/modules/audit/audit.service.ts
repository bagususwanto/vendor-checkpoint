import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { AuditLogFilterDto } from './dto/audit-log-filter.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tx: any, createAuditDto: CreateAuditDto) {
    const prismaClient = tx || this.prisma;

    return await prismaClient.log_audit.create({
      data: {
        entry_id: createAuditDto.entry_id,
        user_id: createAuditDto.user_id,
        action_type: createAuditDto.action_type,
        action_description: createAuditDto.action_description,
        old_value: createAuditDto.old_value,
        new_value: createAuditDto.new_value,
        ip_address: createAuditDto.ip_address,
        user_agent: createAuditDto.user_agent,
        created_at: new Date(),
      },
    });
  }

  findAll() {
    return `This action returns all audit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} audit`;
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }

  async getAuditLogs(filter: AuditLogFilterDto) {
    const dateFrom = new Date(filter.dateFrom);
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = new Date(filter.dateTo);
    dateTo.setHours(23, 59, 59, 999);

    const where: any = {
      created_at: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    if (filter.actionType) {
      where.action_type = filter.actionType;
    }

    if (filter.userId) {
      where.user_id = filter.userId;
    }

    // Get total count
    const total = await this.prisma.log_audit.count({ where });

    // Get paginated data
    const skip = (filter.page - 1) * filter.limit;
    const data = await this.prisma.log_audit.findMany({
      where,
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            full_name: true,
          },
        },
        entry: {
          select: {
            entry_id: true,
            queue_number: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: filter.limit,
    });

    return {
      data,
      meta: {
        total,
        page: filter.page,
        limit: filter.limit,
        totalPages: Math.ceil(total / filter.limit),
      },
    };
  }

  async generateAuditLogExcel(
    filter: AuditLogFilterDto,
    userId: number,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const localUserId = await this.resolveLocalUser(userId);

    const dateFrom = new Date(filter.dateFrom);
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = new Date(filter.dateTo);
    dateTo.setHours(23, 59, 59, 999);

    const where: any = {
      created_at: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    if (filter.actionType) {
      where.action_type = filter.actionType;
    }

    if (filter.userId) {
      where.user_id = filter.userId;
    }

    // Fetch all audit logs
    const logs = await this.prisma.log_audit.findMany({
      where,
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            full_name: true,
          },
        },
        entry: {
          select: {
            entry_id: true,
            queue_number: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Generate filename
    const filename = `audit_log_${filter.dateFrom}_${filter.dateTo}.xlsx`;

    // Log export
    await this.prisma.log_report_export.create({
      data: {
        exported_by_user_id: localUserId,
        report_type: 'AUDIT_LOG',
        date_from: new Date(filter.dateFrom),
        date_to: new Date(filter.dateTo),
        filter_criteria: JSON.stringify(filter),
        total_records: logs.length,
        file_name: filename,
      },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Vendor Checkpoint System';
    workbook.created = new Date();

    // Create audit log sheet
    const sheet = workbook.addWorksheet('Audit Logs');

    // Headers
    const headers = [
      'No',
      'Timestamp',
      'User',
      'Action Type',
      'Description',
      'Queue Number',
      'Entry ID',
      'Old Value',
      'New Value',
      'IP Address',
    ];

    const headerRow = sheet.addRow(headers);
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

    // Data rows
    logs.forEach((log, index) => {
      sheet.addRow([
        index + 1,
        this.formatDateTime(log.created_at),
        log.user?.full_name || '-',
        log.action_type,
        log.action_description,
        log.entry?.queue_number || '-',
        log.entry_id || '-',
        log.old_value || '-',
        log.new_value || '-',
        log.ip_address || '-',
      ]);
    });

    // Auto-fit columns
    sheet.columns.forEach((column, index) => {
      if (index === 0) {
        column.width = 5;
      } else if (index === 1) {
        column.width = 18;
      } else if (index === 4) {
        column.width = 40;
      } else if (index === 7 || index === 8) {
        column.width = 30;
      } else {
        column.width = 15;
      }
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(buffer),
      filename,
    };
  }

  private async resolveLocalUser(tokenUserId: number): Promise<number> {
    // 1. Try to find by user_id (if token ID matches local ID)
    const userById = await this.prisma.mst_user.findUnique({
      where: { user_id: tokenUserId },
    });
    if (userById) return userById.user_id;

    // 2. Try to find by external_user_id (if token ID is external ID)
    const userByExternal = await this.prisma.mst_user.findUnique({
      where: { external_user_id: tokenUserId },
    });
    if (userByExternal) return userByExternal.user_id;

    throw new BadRequestException('User tidak ditemukan dalam database lokal');
  }

  async findUserByExternalId(externalUserId: number) {
    return await this.prisma.mst_user.findUnique({
      where: { external_user_id: externalUserId },
      select: { user_id: true },
    });
  }

  private formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
