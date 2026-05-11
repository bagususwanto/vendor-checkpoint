'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar } from 'lucide-react';

interface DetailHeaderProps {
  companyName: string;
  vendorCode: string;
  dateFrom: string;
  dateTo: string;
}

export function DetailHeader({ companyName, vendorCode, dateFrom, dateTo }: DetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {companyName}
            </h1>
            <Badge
              variant="outline"
              className="rounded-sm px-2 py-0.5 font-mono text-[10px] bg-muted/30"
            >
              {vendorCode}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2 px-2.5 py-1 rounded-md bg-primary/5 border border-primary/10 w-fit">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary/80 uppercase tracking-tight">
              Period: {dateFrom || '-'} — {dateTo || '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
