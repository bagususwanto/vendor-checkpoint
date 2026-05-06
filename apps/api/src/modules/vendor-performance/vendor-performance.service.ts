import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { VendorPerformanceFilterDto } from './dto/vendor-performance-filter.dto';

@Injectable()
export class VendorPerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(filter: VendorPerformanceFilterDto) {
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

    if (filter.vendorId) {
      where.vendor_id = filter.vendorId;
    }

    if (filter.vendorCategoryId) {
      where.snapshot_vendor_category_id = filter.vendorCategoryId;
    }

    return where;
  }

  async getRanking(filter: VendorPerformanceFilterDto) {
    const { page = 1, limit = 10 } = filter;
    const whereClause = this.buildWhereClause(filter);

    // Get all check-ins for the period
    const entries = await this.prisma.ops_checkin_entry.findMany({
      where: whereClause,
      include: {
        ops_timelog: {
          select: {
            departure_status: true,
            duration_minutes: true,
            is_checked_out: true,
          },
        },
      },
    });

    // Get missed cycles for the period
    const missedCycles = await this.prisma.ops_delivery_slot.findMany({
      where: {
        expected_date: {
          gte: new Date(filter.dateFrom),
          lte: new Date(filter.dateTo),
        },
        status: 'Missed',
        schedule: {
          vendor_id: filter.vendorId || undefined,
        },
      },
      include: {
        schedule: {
          select: {
            vendor_id: true,
          },
        },
      },
    });

    // Group by vendor
    const vendorStats = new Map<number, any>();

    entries.forEach((entry) => {
      if (!vendorStats.has(entry.vendor_id)) {
        vendorStats.set(entry.vendor_id, {
          vendor_id: entry.vendor_id,
          company_name: entry.snapshot_company_name,
          category_name: entry.snapshot_category_name,
          total_checkins: 0,
          on_time_arrivals: 0,
          on_time_departures: 0,
          total_checkouts: 0,
          compliant_checkins: 0,
          total_lead_time: 0,
          lead_time_count: 0,
          missed_cycles: 0,
        });
      }

      const stats = vendorStats.get(entry.vendor_id);
      stats.total_checkins++;
      
      if (entry.arrival_status === 'On-Time') {
        stats.on_time_arrivals++;
      }

      if (!entry.has_non_compliant_items) {
        stats.compliant_checkins++;
      }

      if (entry.ops_timelog) {
        if (
          entry.ops_timelog.is_checked_out &&
          entry.ops_timelog.departure_status !== 'Unscheduled'
        ) {
          stats.total_checkouts++;
          if (entry.ops_timelog.departure_status === 'On-Time') {
            stats.on_time_departures++;
          }
        }
        if (entry.ops_timelog.duration_minutes !== null) {
          stats.total_lead_time += entry.ops_timelog.duration_minutes;
          stats.lead_time_count++;
        }
      }
    });

    // Add missed cycles
    missedCycles.forEach((mc) => {
      const vendorId = mc.schedule.vendor_id;
      if (vendorStats.has(vendorId)) {
        vendorStats.get(vendorId).missed_cycles++;
      }
    });

    // Convert to array and calculate rates
    const result = Array.from(vendorStats.values()).map((s) => ({
      vendor_id: s.vendor_id,
      company_name: s.company_name,
      category_name: s.category_name,
      total_checkins: s.total_checkins,
      on_time_arrival_rate: s.total_checkins > 0 ? Math.round((s.on_time_arrivals / s.total_checkins) * 100) : 0,
      on_time_departure_rate: s.total_checkouts > 0 ? Math.round((s.on_time_departures / s.total_checkouts) * 100) : 0,
      compliance_rate: s.total_checkins > 0 ? Math.round((s.compliant_checkins / s.total_checkins) * 100) : 0,
      avg_lead_time: s.lead_time_count > 0 ? Math.round(s.total_lead_time / s.lead_time_count) : 0,
      missed_cycles: s.missed_cycles,
    }));

    // Sort by on-time arrival rate descending
    const sortedResult = result.sort((a, b) => b.on_time_arrival_rate - a.on_time_arrival_rate);
    
    const total = sortedResult.length;
    const total_pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedData = sortedResult.slice(start, start + limit);

    return {
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        total_pages,
      },
    };
  }

  async getTrend(filter: VendorPerformanceFilterDto) {
    const whereClause = this.buildWhereClause(filter);

    const entries = await this.prisma.ops_checkin_entry.findMany({
      where: whereClause,
      include: {
        ops_timelog: {
          select: {
            departure_status: true,
            duration_minutes: true,
            is_checked_out: true,
          },
        },
      },
    });

    const trendMap = new Map<string, any>();

    entries.forEach((entry) => {
      let key = '';
      const date = new Date(entry.submission_time);
      
      if (filter.granularity === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (filter.granularity === 'monthly') {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM
      } else {
        key = `${date.getFullYear()}`; // YYYY
      }

      if (!trendMap.has(key)) {
        trendMap.set(key, {
          label: key,
          total_checkins: 0,
          on_time_arrivals: 0,
          on_time_departures: 0,
          total_checkouts: 0,
          compliant_checkins: 0,
          total_lead_time: 0,
          lead_time_count: 0,
        });
      }

      const stats = trendMap.get(key);
      stats.total_checkins++;
      
      if (entry.arrival_status === 'On-Time') {
        stats.on_time_arrivals++;
      }

      if (!entry.has_non_compliant_items) {
        stats.compliant_checkins++;
      }

      if (entry.ops_timelog) {
        if (entry.ops_timelog.is_checked_out) {
          stats.total_checkouts++;
          if (entry.ops_timelog.departure_status === 'On-Time') {
            stats.on_time_departures++;
          }
        }
        if (entry.ops_timelog.duration_minutes !== null) {
          stats.total_lead_time += entry.ops_timelog.duration_minutes;
          stats.lead_time_count++;
        }
      }
    });

    return Array.from(trendMap.values()).map((s) => ({
      label: s.label,
      total_checkins: s.total_checkins,
      on_time_arrival_pct: s.total_checkins > 0 ? Math.round((s.on_time_arrivals / s.total_checkins) * 100) : 0,
      on_time_departure_pct: s.total_checkouts > 0 ? Math.round((s.on_time_departures / s.total_checkouts) * 100) : 0,
      compliance_rate: s.total_checkins > 0 ? Math.round((s.compliant_checkins / s.total_checkins) * 100) : 0,
      avg_lead_time: s.lead_time_count > 0 ? Math.round(s.total_lead_time / s.lead_time_count) : 0,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }

  async getVendorDetail(vendorId: number, filter: VendorPerformanceFilterDto) {
    const whereClause = this.buildWhereClause({ ...filter, vendorId });

    const [entries, missedCycles, vendor] = await Promise.all([
      this.prisma.ops_checkin_entry.findMany({
        where: whereClause,
        include: {
          ops_timelog: true,
        },
      }),
      this.prisma.ops_delivery_slot.count({
        where: {
          expected_date: {
            gte: new Date(filter.dateFrom),
            lte: new Date(filter.dateTo),
          },
          status: 'Missed',
          schedule: {
            vendor_id: vendorId,
          },
        },
      }),
      this.prisma.mst_vendor.findUnique({
        where: { vendor_id: vendorId },
        include: { vendor_category: true },
      }),
    ]);

    if (!vendor) return null;

    let onTimeArrivals = 0;
    let onTimeDepartures = 0;
    let totalCheckouts = 0;
    let compliantCheckins = 0;
    let totalLeadTime = 0;
    let leadTimeCount = 0;

    entries.forEach((entry) => {
      if (entry.arrival_status === 'On-Time') onTimeArrivals++;
      if (!entry.has_non_compliant_items) compliantCheckins++;
      
      if (entry.ops_timelog) {
        if (
          entry.ops_timelog.is_checked_out &&
          entry.ops_timelog.departure_status !== 'Unscheduled'
        ) {
          totalCheckouts++;
          if (entry.ops_timelog.departure_status === 'On-Time') {
            onTimeDepartures++;
          }
        }
        if (entry.ops_timelog.duration_minutes !== null) {
          totalLeadTime += entry.ops_timelog.duration_minutes;
          leadTimeCount++;
        }
      }
    });

    const totalCheckins = entries.length;

    return {
      vendor_id: vendor.vendor_id,
      company_name: vendor.company_name,
      category_name: vendor.vendor_category?.category_name || 'N/A',
      stats: {
        total_checkins: totalCheckins,
        on_time_arrival_rate: totalCheckins > 0 ? Math.round((onTimeArrivals / totalCheckins) * 100) : 0,
        on_time_departure_rate: totalCheckouts > 0 ? Math.round((onTimeDepartures / totalCheckouts) * 100) : 0,
        compliance_rate: totalCheckins > 0 ? Math.round((compliantCheckins / totalCheckins) * 100) : 0,
        avg_lead_time: leadTimeCount > 0 ? Math.round(totalLeadTime / leadTimeCount) : 0,
        missed_cycles: missedCycles,
      }
    };
  }
}
