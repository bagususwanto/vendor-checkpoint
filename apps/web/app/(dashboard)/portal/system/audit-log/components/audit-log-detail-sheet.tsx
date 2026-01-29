'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuditLog } from '@/services/audit-log.service';
import { formatDateTime } from '@/lib/utils';

import { User, Clock, Activity, FileText } from 'lucide-react';

interface AuditLogDetailSheetProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailSheet({
  log,
  open,
  onOpenChange,
}: AuditLogDetailSheetProps) {
  if (!log) return null;

  const parseValue = (value?: string) => {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch (e) {
      return value;
    }
  };

  const renderValue = (
    label: string,
    value: any,
    colorClass = 'bg-slate-50',
  ) => {
    if (!value) return null;

    const parsedValue = parseValue(value);
    const isObject = typeof parsedValue === 'object' && parsedValue !== null;

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </h4>
        <div className={`rounded-md border p-4 ${colorClass} overflow-x-auto`}>
          {isObject ? (
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {JSON.stringify(parsedValue, null, 2)}
            </pre>
          ) : (
            <p className="text-sm font-mono break-all">{String(parsedValue)}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col h-full ring-offset-0 focus-visible:outline-none [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Detail Audit Log</SheetTitle>
            <Badge variant="outline" className="text-xs">
              ID: {log.audit_id}
            </Badge>
          </div>
          <SheetDescription>
            Detail aktivitas dan perubahan data yang tercatat.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <Card className="p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        User
                      </p>
                      <p className="font-semibold text-base">
                        {log.user?.full_name || 'System / Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.user?.username || '-'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Waktu
                      </p>
                      <p className="font-semibold text-base">
                        {formatDateTime(
                          log.created_at,
                          'dd MMMM yyyy, HH:mm:ss',
                        )}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-green-100 p-2 text-green-600">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-medium text-muted-foreground">
                          Aktivitas
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-xs rounded-sm"
                        >
                          {log.action_type}
                        </Badge>
                      </div>
                      <p className="font-semibold text-base">
                        {log.action_description}
                      </p>
                      {log.entry_id && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Related Entry ID: {log.entry_id}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Changes */}
            {(log.old_value || log.new_value) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Rincian Perubahan Data
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {log.old_value &&
                    renderValue(
                      'Data Sebelum (Old Value)',
                      log.old_value,
                      'bg-red-50/50 border-red-100 text-red-900',
                    )}
                  {log.new_value &&
                    renderValue(
                      'Data Sesudah (New Value)',
                      log.new_value,
                      'bg-green-50/50 border-green-100 text-green-900',
                    )}
                </div>
              </div>
            )}

            {/* Additional Metadata */}
            <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
              <p>IP Address: {log.ip_address || '-'}</p>
              <p>User Agent: {log.user_agent || '-'}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
