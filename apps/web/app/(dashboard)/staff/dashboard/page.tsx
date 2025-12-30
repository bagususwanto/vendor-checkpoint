import { Separator } from '@/components/ui/separator';
import { StatsCard } from './components/stats-card';
import { RecentCheckinsTable } from './components/recent-checkins-table';

export default function DashboardPage() {
  const stats = {
    total: 15,
    approved: 8,
    rejected: 2,
    waiting: 5,
    avgLeadTime: '25 menit',
  };

  return (
    <div className="flex-1">
      <div className="space-y-4">
        <StatsCard stats={stats} />
        <RecentCheckinsTable />
      </div>
    </div>
  );
}
