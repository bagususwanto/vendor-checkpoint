import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SystemConfigService } from '../system-config/system-config.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { ReportExportLogFilterDto } from './dto/report-export-log-filter.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly systemConfigService: SystemConfigService,
  ) {}

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

    // v2: Get arrival status breakdown
    const arrivalBreakdown = await this.prisma.ops_checkin_entry.groupBy({
      by: ['arrival_status'],
      where: whereClause,
      _count: { entry_id: true },
    });

    // v2: Get departure status breakdown (via timelog)
    const departureBreakdown = await this.prisma.ops_timelog.groupBy({
      by: ['departure_status'],
      where: {
        entry: whereClause,
      },
      _count: { entry_id: true },
    });

    // v2: Get AI Safety breakdown
    const aiSafetyBreakdown = await this.prisma.ops_checkin_entry.groupBy({
      by: ['ai_safety_status'],
      where: whereClause,
      _count: { entry_id: true },
    });

    // v2: Get PPE status breakdown
    const ppeStatusBreakdownRaw = await this.prisma.ops_ppe_scan.groupBy({
      by: ['is_compliant'],
      where: {
        entry: whereClause,
      },
      _count: { ppe_scan_id: true },
    });

    // v2: Get PPE incomplete breakdown
    const ppeIncompleteScans = await this.prisma.ops_ppe_scan.findMany({
      where: {
        entry: whereClause,
        is_compliant: false,
      },
      select: {
        has_hardhat: true,
        has_safety_vest: true,
      },
    });

    const incompleteCounts = {
      hardhat: 0,
      vest: 0,
      both: 0,
    };

    ppeIncompleteScans.forEach((scan) => {
      if (!scan.has_hardhat && !scan.has_safety_vest) {
        incompleteCounts.both++;
      } else if (!scan.has_hardhat) {
        incompleteCounts.hardhat++;
      } else if (!scan.has_safety_vest) {
        incompleteCounts.vest++;
      }
    });

    const ppeIncompleteBreakdown = [
      { detail: 'Helm', count: incompleteCounts.hardhat },
      { detail: 'Rompi', count: incompleteCounts.vest },
      { detail: 'Helm & Rompi', count: incompleteCounts.both },
    ];

    // v2: Calculate On-Time rates
    const onTimeArrivals =
      arrivalBreakdown.find((a) => a.arrival_status === 'On-Time')?._count
        .entry_id || 0;
    const onTimeArrivalRate =
      totalCheckins > 0
        ? Math.round((onTimeArrivals / totalCheckins) * 100)
        : 0;

    const totalCheckouts = await this.prisma.ops_timelog.count({
      where: {
        entry: whereClause,
        is_checked_out: true,
      },
    });
    const onTimeDepartures =
      departureBreakdown.find((d) => d.departure_status === 'On-Time')?._count
        .entry_id || 0;
    const onTimeDepartureRate =
      totalCheckouts > 0
        ? Math.round((onTimeDepartures / totalCheckouts) * 100)
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
      arrivalStatusBreakdown: arrivalBreakdown.map((a) => ({
        status: a.arrival_status || 'Unknown',
        count: a._count.entry_id,
      })),
      departureStatusBreakdown: departureBreakdown.map((d) => ({
        status: d.departure_status || 'Unknown',
        count: d._count.entry_id,
      })),
      aiSafetyBreakdown: aiSafetyBreakdown.map((a) => ({
        status: a.ai_safety_status || 'Pending',
        count: a._count.entry_id,
      })),
      ppeStatusBreakdown: ppeStatusBreakdownRaw.map((p) => ({
        status: p.is_compliant ? 'Lengkap' : 'Tidak Lengkap',
        count: p._count.ppe_scan_id,
      })),
      ppeIncompleteBreakdown,
      onTimeArrivalRate,
      onTimeDepartureRate,
      nonCompliantItems: complianceStats._sum?.non_compliant_count || 0,
    };
  }

  async generateExcel(
    filter: ReportFilterDto,
    userId: number,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const localUserId = await this.resolveLocalUser(userId);
    const whereClause = this.buildWhereClause(filter);

    // Check MAX_EXPORT_RECORD_LIMIT
    const maxLimitConfig = await this.systemConfigService.findByConfigKey(
      'MAX_EXPORT_RECORD_LIMIT',
    );
    const maxLimit = maxLimitConfig
      ? parseInt(maxLimitConfig.config_value, 10)
      : 50000;

    const totalRecords = await this.prisma.ops_checkin_entry.count({
      where: whereClause,
    });

    if (totalRecords > maxLimit) {
      throw new BadRequestException(
        `Jumlah data melebihi batas maksimal export (${totalRecords} records). Maksimal: ${maxLimit} records. Silakan persempit filter tanggal.`,
      );
    }

    // Fetch all data needed for the report
    const entries = await this.prisma.ops_checkin_entry.findMany({
      where: whereClause,
      include: {
        mst_vendor: true,
        ops_verification: {
          include: { user: true },
        },
        ops_timelog: {
          include: {
            delay_departure_reason: true,
          },
        },
        delay_arrival_reason: true,
        delivery_slot: {
          include: {
            schedule: true,
          },
        },
        ops_checkin_response: {
          include: {
            checklist_category: true,
            checklist_item: true,
          },
          orderBy: [{ checklist_category_id: 'asc' }, { display_order: 'asc' }],
        },
        ops_ppe_scan: true,
      },
      orderBy: { submission_time: 'desc' },
    });

    // Generate filename
    const timestamp = new Date().getTime();
    const filename = `report_${filter.dateFrom}_${filter.dateTo}_${timestamp}.xlsx`;

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

    if (filter.vendorCategoryId) {
      where.snapshot_vendor_category_id = filter.vendorCategoryId;
    }

    if (filter.arrivalStatus) {
      where.arrival_status = filter.arrivalStatus;
    }

    if (filter.departureStatus) {
      where.ops_timelog = {
        departure_status: filter.departureStatus,
      };
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
    sheet.getCell('A1').value = 'LAPORAN KINERJA VENDOR';
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
      ['On-Time Arrival Rate', `${preview.onTimeArrivalRate}%`],
      ['On-Time Departure Rate', `${preview.onTimeDepartureRate}%`],
      ['Total Non-Compliant Items', preview.nonCompliantItems],
    ];

    stats.forEach((stat, index) => {
      sheet.getCell(`A${statsStart + index}`).value = stat[0];
      sheet.getCell(`B${statsStart + index}`).value = stat[1];
    });

    // Arrival Status Breakdown
    const arrivalStart = statsStart + stats.length + 2;
    sheet.getCell(`A${arrivalStart}`).value = 'Breakdown Arrival Status';
    sheet.getCell(`A${arrivalStart}`).font = { bold: true };

    preview.arrivalStatusBreakdown.forEach((a: any, index: number) => {
      sheet.getCell(`A${arrivalStart + 1 + index}`).value = a.status;
      sheet.getCell(`B${arrivalStart + 1 + index}`).value = a.count;
    });

    // Departure Status Breakdown
    const departureStart =
      arrivalStart + preview.arrivalStatusBreakdown.length + 2;
    sheet.getCell(`A${departureStart}`).value = 'Breakdown Departure Status';
    sheet.getCell(`A${departureStart}`).font = { bold: true };

    preview.departureStatusBreakdown.forEach((d: any, index: number) => {
      sheet.getCell(`A${departureStart + 1 + index}`).value = d.status;
      sheet.getCell(`B${departureStart + 1 + index}`).value = d.count;
    });

    // AI Safety Breakdown
    const aiSafetyStart =
      departureStart + preview.departureStatusBreakdown.length + 2;
    sheet.getCell(`A${aiSafetyStart}`).value = 'Breakdown AI Safety';
    sheet.getCell(`A${aiSafetyStart}`).font = { bold: true };

    preview.aiSafetyBreakdown.forEach((a: any, index: number) => {
      sheet.getCell(`A${aiSafetyStart + 1 + index}`).value = a.status;
      sheet.getCell(`B${aiSafetyStart + 1 + index}`).value = a.count;
    });

    // Status Breakdown
    const statusStart = aiSafetyStart + preview.aiSafetyBreakdown.length + 2;
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
      'DN Number',
      'PO Number',
      'Arrival Status',
      'Alasan Terlambat Datang',
      'AI Safety Status',
      'Check-in Time',
      'Checkout Time',
      'Duration (min)',
      'Departure Status',
      'Alasan Terlambat Keluar',
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
        entry.dn_number || '-',
        entry.po_number || '-',
        entry.arrival_status || '-',
        entry.delay_arrival_reason?.reason_text || '-',
        entry.ai_safety_status || '-',
        entry.ops_timelog?.checkin_time
          ? this.formatDateTime(entry.ops_timelog.checkin_time)
          : '-',
        entry.ops_timelog?.checkout_time
          ? this.formatDateTime(entry.ops_timelog.checkout_time)
          : '-',
        entry.ops_timelog?.duration_minutes || '-',
        entry.ops_timelog?.departure_status || '-',
        entry.ops_timelog?.delay_departure_reason?.reason_text || '-',
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
      'Kategori Vendor',
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

  async generateCycleExcel(
    filter: ReportFilterDto,
    userId: number,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const localUserId = await this.resolveLocalUser(userId);
    const dateFrom = new Date(filter.dateFrom);
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = new Date(filter.dateTo);
    dateTo.setHours(23, 59, 59, 999);

    const checkins = await this.prisma.ops_checkin_entry.findMany({
      where: {
        submission_time: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      include: {
        mst_vendor: true,
        delivery_slot: {
          include: {
            schedule: true,
          },
        },
        ops_timelog: true,
      },
      orderBy: { submission_time: 'desc' },
    });

    const timestamp = new Date().getTime();
    const filename = `cycle_monitoring_${filter.dateFrom}_${filter.dateTo}_${timestamp}.xlsx`;

    await this.prisma.log_report_export.create({
      data: {
        exported_by_user_id: localUserId,
        report_type: 'CYCLE_MONITORING',
        date_from: dateFrom,
        date_to: dateTo,
        filter_criteria: JSON.stringify(filter),
        total_records: checkins.length,
        file_name: filename,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Cycle Monitoring');

    const headers = [
      'No',
      'Vendor',
      'Queue Number',
      'Expected Check-in',
      'Actual Check-in',
      'Arrival Status',
      'Actual Checkout',
      'Departure Status',
      'Duration (min)',
      'DN Number',
      'PO Number',
      'AI Safety Status',
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };

    checkins.forEach((entry, index) => {
      let expectedCheckin = '-';
      if (entry.delivery_slot) {
        expectedCheckin = `${this.formatDateTime(entry.delivery_slot.expected_date)} ${entry.delivery_slot.schedule.arrival_time || ''}`;
      }

      sheet.addRow([
        index + 1,
        entry.snapshot_company_name,
        entry.queue_number,
        expectedCheckin,
        this.formatDateTime(entry.submission_time),
        entry.arrival_status || '-',
        entry.ops_timelog?.checkout_time
          ? this.formatDateTime(entry.ops_timelog.checkout_time)
          : '-',
        entry.ops_timelog?.departure_status || '-',
        entry.ops_timelog?.duration_minutes || '-',
        entry.dn_number || '-',
        entry.po_number || '-',
        entry.ai_safety_status || '-',
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(buffer),
      filename,
    };
  }

  async getExportLogs(filter: ReportExportLogFilterDto) {
    const dateFrom = new Date(filter.dateFrom);
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = new Date(filter.dateTo);
    dateTo.setHours(23, 59, 59, 999);

    const where: any = {
      export_time: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    if (filter.reportType) {
      where.report_type = filter.reportType;
    }

    // Get total count
    const total = await this.prisma.log_report_export.count({ where });

    // Get paginated data
    const skip = (filter.page - 1) * filter.limit;
    const data = await this.prisma.log_report_export.findMany({
      where,
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            full_name: true,
          },
        },
      },
      orderBy: { export_time: 'desc' },
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
}
