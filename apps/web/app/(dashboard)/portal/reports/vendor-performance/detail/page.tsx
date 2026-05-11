'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useVendorDetail } from '@/hooks/api/use-vendor-performance';
import { VendorPerformanceFilter } from '@repo/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useUser } from '@/hooks/api/use-auth';
import { UserRole } from '@repo/types';
import { AdjustmentDialog } from '../components/adjustment-dialog';
import { RoleGuard } from '@/components/auth/role-guard';

// Import refactored components
import { DetailHeader } from '../components/detail-header';
import { DetailStats } from '../components/detail-stats';
import { DetailSuccessRates } from '../components/detail-success-rates';
import { DetailHistory } from '../components/detail-history';

function VendorDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const vendorIdStr = searchParams.get('vendorId');
  const vendorId = vendorIdStr ? parseInt(vendorIdStr, 10) : null;

  const filter = React.useMemo<VendorPerformanceFilter>(() => {
    return {
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      granularity:
        (searchParams.get('granularity') as 'daily' | 'monthly' | 'yearly') ||
        'daily',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    };
  }, [searchParams]);

  const { data: detail, isLoading } = useVendorDetail(vendorId, filter);

  const [selectedEntry, setSelectedEntry] = React.useState<any>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = React.useState(false);

  const canAdjust =
    user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.SECTION_HEAD;

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col h-full min-h-[500px] items-center justify-center space-y-4">
        <div className="text-muted-foreground">
          Failed to load vendor details or vendor not found.
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.GROUP_HEAD,
        UserRole.LINE_HEAD,
        UserRole.SECTION_HEAD,
      ]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <DetailHeader 
          companyName={detail.company_name}
          vendorCode={detail.vendor_code}
          dateFrom={filter.dateFrom}
          dateTo={filter.dateTo}
        />

        <Separator className="mb-6" />

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-8">
            <DetailStats 
              totalCheckins={detail.stats.total_checkins}
              avgLeadTime={detail.stats.avg_lead_time}
            />

            <DetailSuccessRates 
              onTimeArrivalRate={detail.stats.on_time_arrival_rate}
              onTimeDepartureRate={detail.stats.on_time_departure_rate}
              complianceRate={detail.stats.compliance_rate}
              missedCycles={detail.stats.missed_cycles}
            />
          </div>

          <div className="md:col-span-8 space-y-4">
            <DetailHistory 
              entries={detail.entries}
              canAdjust={canAdjust}
              onAdjust={(entry) => {
                setSelectedEntry(entry);
                setIsAdjustmentOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      <AdjustmentDialog
        entry={selectedEntry}
        isOpen={isAdjustmentOpen}
        onClose={() => {
          setIsAdjustmentOpen(false);
          setSelectedEntry(null);
        }}
      />
    </RoleGuard>
  );
}

export default function VendorDetailPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-full min-h-[500px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VendorDetailContent />
    </Suspense>
  );
}
