import { Separator } from '@/components/ui/separator';
import { StatsCard } from '../components/stats-card';
import { RecentCheckinsTable } from '../components/recent-checkins-table';

export default function LeaderDashboardPage() {
  return (
    <div className="flex-1">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Leader</h2>
        <Separator />
        <StatsCard />
        <RecentCheckinsTable />
      </div>
    </div>
  );
}
