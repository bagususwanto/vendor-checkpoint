import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getPreview(filter: ReportFilterDto) {
    const whereClause = this.buildWhereClause(filter);

    // Get total check-ins
    const totalCheckins = await this.prisma.ops_checkin_entry.count({
      where: whereClause,
    });

    // Get status breakdown
    const statusBreakdown = await this.prisma.ops_checkin_entry.groupBy({
      by: ['current_status'],
      where: whereClause,
      _count: { entry_id: true },
    });

    // Get category breakdown
    const categoryBreakdown = await this.prisma.ops_checkin_entry.groupBy({
      by: ['snapshot_category_name'],
      where: whereClause,
      _count: { entry_id: true },
    });

    // Get compliance stats
    const complianceStats = await this.prisma.ops_checkin_entry.aggregate({
      where: whereClause,
      _count: { entry_id: true },
      _sum: { non_compliant_count: true },
    });

    const entriesWithNonCompliant = await this.prisma.ops_checkin_entry.count({
      where: {
        ...whereClause,
        has_non_compliant_items: true,
      },
    });

    const complianceRate =
      totalCheckins > 0
        ? Math.round(
            ((totalCheckins - entriesWithNonCompliant) / totalCheckins) * 100,
          )
        : 0;

    return {
      period: {
        from: filter.dateFrom,
        to: filter.dateTo,
      },
      totalCheckins,
      complianceRate,
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.current_status,
        count: s._count.entry_id,
      })),
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c.snapshot_category_name,
        count: c._count.entry_id,
      })),
      nonCompliantItems: complianceStats._sum?.non_compliant_count || 0,
    };
  }

  async generateExcel(
    filter: ReportFilterDto,
    userId: number,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const localUserId = await this.resolveLocalUser(userId);
    const whereClause = this.buildWhereClause(filter);

    // Fetch all data needed for the report
    const entries = await this.prisma.ops_checkin_entry.findMany({
      where: whereClause,
      include: {
        mst_vendor: true,
        material_category: true,
        ops_verification: {
          include: { user: true },
        },
        ops_timelog: true,
        ops_checkin_response: {
          include: {
            checklist_category: true,
            checklist_item: true,
          },
          orderBy: [{ checklist_category_id: 'asc' }, { display_order: 'asc' }],
        },
      },
      orderBy: { submission_time: 'desc' },
    });

    // Generate filename
    const filename = `report_${filter.dateFrom}_${filter.dateTo}.xlsx`;

    // Log export
    await this.prisma.log_report_export.create({
      data: {
        exported_by_user_id: localUserId,
        report_type: 'CHECKIN_REPORT',
        date_from: new Date(filter.dateFrom),
        date_to: new Date(filter.dateTo),
        filter_criteria: JSON.stringify(filter),
        total_records: entries.length,
        file_name: filename,
      },
    });

    // Get preview stats for summary sheet
    const preview = await this.getPreview(filter);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Vendor Checkpoint System';
    workbook.created = new Date();

    // Sheet 1: Summary
    this.createSummarySheet(workbook, preview, filter);

    // Sheet 2: Details
    this.createDetailsSheet(workbook, entries);

    // Sheet 3: Checklist Answers
    this.createChecklistSheet(workbook, entries);

    // Sheet 4: Non-Compliance Report
    this.createNonComplianceSheet(workbook, entries);

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

  private buildWhereClause(filter: ReportFilterDto) {
    const dateFrom = new Date(filter.dateFrom);
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = new Date(filter.dateTo);
    dateTo.setHours(23, 59, 59, 999);

    const where: any = {
      submission_time: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    if (filter.status) {
      where.current_status = filter.status;
    }

    if (filter.materialCategoryId) {
      where.material_category_id = filter.materialCategoryId;
    }

    return where;
  }

  private createSummarySheet(
    workbook: ExcelJS.Workbook,
    preview: any,
    filter: ReportFilterDto,
  ) {
    const sheet = workbook.addWorksheet('Summary');

    // Title
    sheet.mergeCells('A1:B1');
    sheet.getCell('A1').value = 'LAPORAN CHECK-IN VENDOR';
    sheet.getCell('A1').font = { bold: true, size: 16 };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    // Period
    sheet.getCell('A3').value = 'Periode';
    sheet.getCell('B3').value = `${filter.dateFrom} s/d ${filter.dateTo}`;

    // Stats
    const statsStart = 5;
    const stats = [
      ['Total Check-in', preview.totalCheckins],
      ['Compliance Rate', `${preview.complianceRate}%`],
      ['Total Non-Compliant Items', preview.nonCompliantItems],
    ];

    stats.forEach((stat, index) => {
      sheet.getCell(`A${statsStart + index}`).value = stat[0];
      sheet.getCell(`B${statsStart + index}`).value = stat[1];
    });

    // Status Breakdown
    const statusStart = statsStart + stats.length + 2;
    sheet.getCell(`A${statusStart}`).value = 'Breakdown per Status';
    sheet.getCell(`A${statusStart}`).font = { bold: true };

    preview.statusBreakdown.forEach((s: any, index: number) => {
      sheet.getCell(`A${statusStart + 1 + index}`).value = s.status;
      sheet.getCell(`B${statusStart + 1 + index}`).value = s.count;
    });

    // Category Breakdown
    const categoryStart = statusStart + preview.statusBreakdown.length + 3;
    sheet.getCell(`A${categoryStart}`).value = 'Breakdown per Kategori';
    sheet.getCell(`A${categoryStart}`).font = { bold: true };

    preview.categoryBreakdown.forEach((c: any, index: number) => {
      sheet.getCell(`A${categoryStart + 1 + index}`).value = c.category;
      sheet.getCell(`B${categoryStart + 1 + index}`).value = c.count;
    });

    // Column widths
    sheet.getColumn(1).width = 30;
    sheet.getColumn(2).width = 25;
  }

  private createDetailsSheet(workbook: ExcelJS.Workbook, entries: any[]) {
    const sheet = workbook.addWorksheet('Details');

    // Headers
    const headers = [
      'No',
      'Queue Number',
      'Vendor',
      'Driver',
      'Kategori',
      'Status',
      'Check-in Time',
      'Checkout Time',
      'Duration (min)',
      'Compliance',
      'Non-Compliant Count',
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
    entries.forEach((entry, index) => {
      sheet.addRow([
        index + 1,
        entry.queue_number,
        entry.snapshot_company_name,
        entry.driver_name,
        entry.snapshot_category_name,
        entry.current_status,
        entry.ops_timelog?.checkin_time
          ? this.formatDateTime(entry.ops_timelog.checkin_time)
          : '-',
        entry.ops_timelog?.checkout_time
          ? this.formatDateTime(entry.ops_timelog.checkout_time)
          : '-',
        entry.ops_timelog?.duration_minutes || '-',
        entry.has_non_compliant_items ? 'TIDAK PATUH' : 'PATUH',
        entry.non_compliant_count,
      ]);
    });

    // Auto-fit columns
    sheet.columns.forEach((column) => {
      column.width = 15;
    });
    sheet.getColumn(1).width = 5;
    sheet.getColumn(3).width = 30;
    sheet.getColumn(4).width = 20;
  }

  private createChecklistSheet(workbook: ExcelJS.Workbook, entries: any[]) {
    const sheet = workbook.addWorksheet('Checklist Answers');

    // Headers
    const headers = [
      'Queue Number',
      'Vendor',
      'Category',
      'Item',
      'Response',
      'Compliant',
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
    entries.forEach((entry) => {
      entry.ops_checkin_response.forEach((response: any) => {
        const row = sheet.addRow([
          entry.queue_number,
          entry.snapshot_company_name,
          response.checklist_category?.category_name || '-',
          response.item_text_snapshot,
          response.response_value ? 'YA' : 'TIDAK',
          response.is_compliant ? 'YA' : 'TIDAK',
        ]);

        // Highlight non-compliant rows
        if (!response.is_compliant) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFCCCC' },
            };
          });
        }
      });
    });

    // Column widths
    sheet.getColumn(1).width = 15;
    sheet.getColumn(2).width = 30;
    sheet.getColumn(3).width = 20;
    sheet.getColumn(4).width = 50;
    sheet.getColumn(5).width = 10;
    sheet.getColumn(6).width = 10;
  }

  private createNonComplianceSheet(workbook: ExcelJS.Workbook, entries: any[]) {
    const sheet = workbook.addWorksheet('Non-Compliance Report');

    // Headers
    const headers = [
      'No',
      'Queue Number',
      'Vendor',
      'Driver',
      'Kategori Material',
      'Checklist Category',
      'Item',
      'Submission Time',
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF9999' },
      };
      cell.border = {
        bottom: { style: 'thin' },
      };
    });

    // Filter only non-compliant responses
    let rowNum = 0;
    entries.forEach((entry) => {
      const nonCompliantResponses = entry.ops_checkin_response.filter(
        (r: any) => !r.is_compliant,
      );

      nonCompliantResponses.forEach((response: any) => {
        rowNum++;
        sheet.addRow([
          rowNum,
          entry.queue_number,
          entry.snapshot_company_name,
          entry.driver_name,
          entry.snapshot_category_name,
          response.checklist_category?.category_name || '-',
          response.item_text_snapshot,
          this.formatDateTime(entry.submission_time),
        ]);
      });
    });

    // If no non-compliant items
    if (rowNum === 0) {
      sheet.addRow(['Tidak ada item yang tidak patuh dalam periode ini.']);
    }

    // Column widths
    sheet.getColumn(1).width = 5;
    sheet.getColumn(2).width = 15;
    sheet.getColumn(3).width = 30;
    sheet.getColumn(4).width = 20;
    sheet.getColumn(5).width = 20;
    sheet.getColumn(6).width = 20;
    sheet.getColumn(7).width = 50;
    sheet.getColumn(8).width = 18;
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
