'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportPreviewData } from '@/services/report.service';
import {
  ReceiptText,
  CheckCircle2,
  AlertTriangle,
  PieChart,
  Info,
} from 'lucide-react';

interface ReportPreviewProps {
  data: ReportPreviewData | undefined;
  isLoading: boolean;
}

export function ReportPreview({ data, isLoading }: ReportPreviewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Check-in</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalCheckins} records
            </div>
            <p className="text-xs text-muted-foreground">
              Periode {data.period?.from} - {data.period?.to}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On-Time Arrival
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.onTimeArrivalRate}%</div>
            <p className="text-xs text-muted-foreground">Rate kedatangan tepat waktu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On-Time Departure
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.onTimeDepartureRate}%</div>
            <p className="text-xs text-muted-foreground">Rate keberangkatan tepat waktu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Rate
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Non-compliant items: {data.nonCompliantItems}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Arrival Status
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.arrivalStatusBreakdown?.map((s) => (
                <div
                  key={s.status}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-muted-foreground">
                    {s.status}
                  </span>
                  <span>{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Departure Status
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.departureStatusBreakdown?.map((s) => (
                <div
                  key={s.status}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-muted-foreground">
                    {s.status}
                  </span>
                  <span>{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Safety Status
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.aiSafetyBreakdown?.map((s) => (
                <div
                  key={s.status}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-muted-foreground">
                    {s.status}
                  </span>
                  <span>{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PPE Scan Status
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.ppeStatusBreakdown?.map((s) => (
                <div
                  key={s.status}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-muted-foreground">
                    {s.status}
                  </span>
                  <span>{s.count}</span>
                </div>
              ))}
              {(!data.ppeStatusBreakdown ||
                data.ppeStatusBreakdown.length === 0) && (
                <p className="text-xs text-muted-foreground">Tidak ada data</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PPE Incomplete Details
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.ppeIncompleteBreakdown?.map((s) => (
                <div
                  key={s.detail}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-muted-foreground">
                    {s.detail}
                  </span>
                  <span>{s.count}</span>
                </div>
              ))}
              {(!data.ppeIncompleteBreakdown ||
                data.ppeIncompleteBreakdown.length === 0) && (
                <p className="text-xs text-muted-foreground">Tidak ada data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Breakdown Kategori Vendor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.categoryBreakdown?.map((c) => (
              <div
                key={c.category}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <span className="text-sm font-medium">{c.category}</span>
                <span className="text-sm text-muted-foreground">{c.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
