'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckinList } from './checkin-list';
import { QueueStatus } from '@repo/types';

export function RecentCheckinsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-in Terbaru</CardTitle>
        <CardDescription>
          Kelola check-in yang perlu diverifikasi atau di-checkout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="waiting" className="space-y-4">
          <TabsList>
            <TabsTrigger value="waiting">Menunggu Verifikasi</TabsTrigger>
            <TabsTrigger value="approved">Siap Check-Out</TabsTrigger>
            <TabsTrigger value="rejected">Ditolak</TabsTrigger>
          </TabsList>
          <TabsContent value="waiting" className="space-y-4">
            <CheckinList status={QueueStatus.MENUNGGU} />
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            <CheckinList status={QueueStatus.DISETUJUI} />
          </TabsContent>
          <TabsContent value="rejected" className="space-y-4">
            <CheckinList status={QueueStatus.DITOLAK} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
