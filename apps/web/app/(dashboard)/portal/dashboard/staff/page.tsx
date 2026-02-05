import { Separator } from '@/components/ui/separator';
import { RecentCheckinsTable } from '../components/recent-checkins-table';

export default function StaffDashboardPage() {
  return (
    <div className="flex-1">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Petugas</h2>
        <Separator />
        <RecentCheckinsTable />
      </div>
    </div>
  );
}
