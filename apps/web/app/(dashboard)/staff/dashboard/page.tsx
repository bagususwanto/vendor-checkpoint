import { Separator } from '@/components/ui/separator';
import { StatsCard } from './components/stats-card';
import { RecentCheckinsTable } from './components/recent-checkins-table';

export default function DashboardPage() {
  return (
    <div className="flex-1">
      <div className="space-y-4">
        <StatsCard />
        <RecentCheckinsTable />
      </div>
    </div>
  );
}
