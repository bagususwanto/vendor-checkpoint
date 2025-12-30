import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { getStartOfToday } from 'src/common/utils/today-date.util';
import { formatDate } from 'src/common/utils/format-date.util';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findDailyStats() {
    const today = getStartOfToday();

    const [
      totalCheckins,
      totalApproved,
      totalRejected,
      currentWaiting,
      leadTimeAgg,
    ] = await Promise.all([
      // Total checkins today
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: today,
          },
        },
      }),
      // Total approved today
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: today,
          },
          current_status: 'DISETUJUI',
        },
      }),
      // Total rejected today
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: today,
          },
          current_status: 'DITOLAK',
        },
      }),
      // Current waiting (active queue today)
      this.prisma.ops_checkin_entry.count({
        where: {
          submission_time: {
            gte: today,
          },
          current_status: 'MENUNGGU',
        },
      }),
      // Avg lead time for today's completed entries
      this.prisma.ops_timelog.aggregate({
        _avg: {
          duration_minutes: true,
        },
        where: {
          entry: {
            submission_time: {
              gte: today,
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
      date: formatDate(today),
      total_checkins: totalCheckins,
      total_approved: totalApproved,
      total_rejected: totalRejected,
      avg_lead_time_minutes: Math.round(leadTimeAgg._avg.duration_minutes || 0),
      current_waiting: currentWaiting,
      approval_rate: `${approvalRate.toFixed(1)}%`,
      rejected_rate: `${rejectedRate.toFixed(1)}%`,
    };
  }
}
