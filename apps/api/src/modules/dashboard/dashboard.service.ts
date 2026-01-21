import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { getStartOfToday } from 'src/common/utils/today-date.util';
import { formatDate } from 'src/common/utils/format-date.util';

import { QueueStatus } from '@repo/types';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findDailyStats() {
    const today = getStartOfToday();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [todayStats, yesterdayStats] = await Promise.all([
      this.getStatsForDate(today),
      this.getStatsForDate(yesterday, true), // end date is today (exclusive)
    ]);

    const calculateTrend = (
      current: number,
      previous: number,
    ): { direction: 'up' | 'down' | 'neutral'; percentage: number } => {
      if (previous === 0) {
        return {
          direction: current > 0 ? 'up' : 'neutral',
          percentage: current > 0 ? 100 : 0,
        };
      }
      const change = current - previous;
      const percentage = (change / previous) * 100;
      return {
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        percentage: Math.abs(Math.round(percentage)),
      };
    };

    return {
      date: formatDate(today),
      ...todayStats,
      trends: {
        total_checkins: calculateTrend(
          todayStats.total_checkins,
          yesterdayStats.total_checkins,
        ),
        total_approved: calculateTrend(
          todayStats.total_approved,
          yesterdayStats.total_approved,
        ),
        total_rejected: calculateTrend(
          todayStats.total_rejected,
          yesterdayStats.total_rejected,
        ),
        avg_lead_time: calculateTrend(
          todayStats.avg_lead_time_minutes,
          yesterdayStats.avg_lead_time_minutes,
        ),
      },
    };
  }

  // Helper to get stats for a specific date range (single day)
  private async getStatsForDate(startDate: Date, isYesterday = false) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const [
      totalCheckins,
      totalApproved,
      totalRejected,
      currentWaiting,
      leadTimeAgg,
    ] = await Promise.all([
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: startDate,
            lt: endDate,
          },
          current_status: { in: [QueueStatus.DISETUJUI, QueueStatus.SELESAI] },
        },
      }),
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: startDate,
            lt: endDate,
          },
          current_status: QueueStatus.DITOLAK,
        },
      }),
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: startDate,
            lt: endDate,
          },
          current_status: QueueStatus.MENUNGGU,
        },
      }),
      this.prisma.ops_timelog.aggregate({
        _avg: {
          duration_minutes: true,
        },
        where: {
          entry: {
            submission_time: {
              gte: startDate,
              lt: endDate,
            },
          },
        },
      }),
    ]);

    const approvalRate =
      totalCheckins > 0 ? (totalApproved / totalCheckins) * 100 : 0;
    const rejectedRate =
      totalCheckins > 0 ? (totalRejected / totalCheckins) * 100 : 0;

    return {
      total_checkins: totalCheckins,
      total_approved: totalApproved,
      total_rejected: totalRejected,
      current_waiting: currentWaiting,
      avg_lead_time_minutes: Math.round(leadTimeAgg._avg.duration_minutes || 0),
      approval_rate: `${approvalRate.toFixed(1)}%`,
      rejected_rate: `${rejectedRate.toFixed(1)}%`,
    };
  }

  async findHourlyLeadTime() {
    const today = getStartOfToday();
    const completedEntries = await this.prisma.ops_timelog.findMany({
      where: {
        entry: {
          submission_time: {
            gte: today,
          },
        },
        duration_minutes: {
          not: null,
        },
      },
      select: {
        duration_minutes: true,
        entry: {
          select: {
            submission_time: true,
          },
        },
      },
    });

    const hours = Array.from({ length: 11 }, (_, i) => i + 7); // 07:00 to 17:00
    const result = hours.map((hour) => {
      const entriesInHour = completedEntries.filter((record) => {
        const entryHour = new Date(record.entry.submission_time).getHours();
        return entryHour === hour;
      });

      const avgLeadTime =
        entriesInHour.length > 0
          ? entriesInHour.reduce(
              (sum, record) => sum + (record.duration_minutes || 0),
              0,
            ) / entriesInHour.length
          : 0;

      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        lead_time: Math.round(avgLeadTime),
      };
    });

    return result;
  }

  async findComplianceRateByHour() {
    const today = getStartOfToday();
    const entries = await this.prisma.ops_checkin_entry.findMany({
      where: {
        submission_time: {
          gte: today,
        },
      },
      select: {
        submission_time: true,
        has_non_compliant_items: true,
      },
    });

    const hours = Array.from({ length: 11 }, (_, i) => i + 7); // 07:00 to 17:00
    const result = hours.map((hour) => {
      const entriesInHour = entries.filter((entry) => {
        const entryHour = new Date(entry.submission_time).getHours();
        return entryHour === hour;
      });

      const total = entriesInHour.length;
      const compliantCount = entriesInHour.filter(
        (e) => !e.has_non_compliant_items,
      ).length;
      const rate = total > 0 ? (compliantCount / total) * 100 : 0;

      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        compliance_rate: Math.round(rate),
        total_entries: total,
      };
    });

    return result;
  }

  async findChecklistBreakdown() {
    const today = getStartOfToday();

    // Get all categories first
    const categories = await this.prisma.mst_checklist_category.findMany({
      where: { is_active: true },
      select: {
        checklist_category_id: true,
        category_name: true,
        color_code: true,
      },
      orderBy: { display_order: 'asc' },
    });

    // Get all responses for today
    const responses = await this.prisma.ops_checkin_response.findMany({
      where: {
        entry: {
          submission_time: {
            gte: today,
          },
        },
      },
      select: {
        checklist_category_id: true,
        is_compliant: true,
      },
    });

    const breakdown = categories.map((category) => {
      const categoryResponses = responses.filter(
        (r) => r.checklist_category_id === category.checklist_category_id,
      );

      const total = categoryResponses.length;
      const compliantCount = categoryResponses.filter(
        (r) => r.is_compliant,
      ).length;
      const rate = total > 0 ? (compliantCount / total) * 100 : 0;

      return {
        id: category.checklist_category_id,
        name: category.category_name,
        color: category.color_code || '#cbd5e1', // default slate-300
        total_items: total,
        compliant_items: compliantCount,
        compliance_rate: Math.round(rate),
      };
    });

    return breakdown;
  }
}
