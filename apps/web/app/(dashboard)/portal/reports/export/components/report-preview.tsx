'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportPreviewData } from '@/services/report.service';
import {
  ReceiptText,
  CheckCircle2,
  AlertTriangle,
  PieChart,
} from 'lucide-react';

interface ReportPreviewProps {
  data: ReportPreviewData | undefined;
  isLoading: boolean;
}

export function ReportPreview({ data, isLoading }: ReportPreviewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mt-6">
        {[1, 2, 3].map((i) => (
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Check-in
            </CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCheckins}</div>
            <p className="text-xs text-muted-foreground">
              Periode {data.period?.from} - {data.period?.to}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.complianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Non-compliant items: {data.nonCompliantItems}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status Check-in
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.statusBreakdown?.map((s) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Breakdown Kategori Material
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
