import { Separator } from '@/components/ui/separator';
import { StatsCard } from '../components/stats-card';
import { RecentCheckinsTable } from '../components/recent-checkins-table';
import { LeadTimeChart } from '../components/lead-time-chart';
import { ComplianceChart } from '../components/compliance-chart';
import { ChecklistBreakdown } from '../components/checklist-breakdown';

export default function LeaderDashboardPage() {
  return (
    <div className="flex-1">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Leader</h2>
        <Separator />

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
