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
        <CardTitle>Recent Check-ins</CardTitle>
        <CardDescription>
          Manage check-ins that need to be verified or checked out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="waiting" className="space-y-4">
          <TabsList>
            <TabsTrigger value="waiting">Waiting Verification</TabsTrigger>
            <TabsTrigger value="approved">Ready for Check-Out</TabsTrigger>
            <TabsTrigger value="held">On Hold</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="waiting" className="space-y-4">
            <CheckinList status={QueueStatus.WAITING} />
          </TabsContent>
          <TabsContent value="approved" className="space-y-4">
            <CheckinList status={`${QueueStatus.APPROVED},${QueueStatus.ACTIVE}`} />
          </TabsContent>
          <TabsContent value="held" className="space-y-4">
            <CheckinList status={QueueStatus.ON_HOLD} />
          </TabsContent>
          <TabsContent value="rejected" className="space-y-4">
            <CheckinList status={QueueStatus.REJECTED} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
