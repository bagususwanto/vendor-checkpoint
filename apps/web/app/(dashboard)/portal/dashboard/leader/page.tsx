import { LeadTimeChart } from '../components/lead-time-chart';
import { ComplianceChart } from '../components/compliance-chart';
import { ChecklistBreakdown } from '../components/checklist-breakdown';
import { formatDateTime } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { StatsCard } from '../components/stats-card';
import { RecentCheckinsTable } from '../components/recent-checkins-table';

export default function LeaderDashboardPage() {
  const today = new Date();

  return (
    <div className="flex-1">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Dashboard Leader
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDateTime(today, 'EEEE, dd MMMM yyyy')}</span>
          </div>
        </div>
        {/* <Separator /> */}

        <StatsCard />

        <div className="grid gap-4 md:grid-cols-2">
          <LeadTimeChart />
          <ComplianceChart />
        </div>

        <ChecklistBreakdown />

        <RecentCheckinsTable />
      </div>
    </div>
  );
}
