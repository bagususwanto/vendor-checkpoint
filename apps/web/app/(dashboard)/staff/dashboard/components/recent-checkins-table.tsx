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
          </TabsList>
          <TabsContent value="waiting" className="space-y-4">
            <CheckinList status="WAITING" />
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            <CheckinList status="APPROVED" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
