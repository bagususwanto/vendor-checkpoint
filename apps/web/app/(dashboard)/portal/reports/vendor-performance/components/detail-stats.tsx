'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, ListFilter } from 'lucide-react';

interface DetailStatsProps {
  totalCheckins: number;
  avgLeadTime: number;
}

export function DetailStats({ totalCheckins, avgLeadTime }: DetailStatsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Timer className="h-5 w-5 text-muted-foreground" />
        Performance Overview
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-none">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <ListFilter className="h-3 w-3" />
              Total Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-3xl font-bold">{totalCheckins}</div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <Timer className="h-3 w-3" />
              Avg Lead Time
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-3xl font-bold">{avgLeadTime}m</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
