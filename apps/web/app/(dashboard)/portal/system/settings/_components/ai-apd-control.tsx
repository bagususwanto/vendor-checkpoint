'use client';

import { useState } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScanFace, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSystemConfigs, useUpdateSystemConfig } from '@/hooks/api/use-system-config';
import { toast } from 'sonner';

export function AiApdControl() {
  const { data, isLoading } = useSystemConfigs({ search: 'AI_APD_DETECTION_ENABLED' });
  const { mutate: updateConfig, isPending } = useUpdateSystemConfig();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const config = data?.data?.find((c) => c.config_key === 'AI_APD_DETECTION_ENABLED');
  const isEnabled = config?.config_value === 'true';

  const handleToggle = (checked: boolean) => {
    setPendingValue(checked);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!config || pendingValue === null) return;

    updateConfig(
      {
        id: config.config_id,
        data: { config_value: String(pendingValue) },
      },
      {
        onSuccess: () => {
          toast.success(
            `AI PPE detection successfully ${pendingValue ? 'enabled' : 'disabled'}.`
          );
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error('Failed to change PPE detection configuration', {
            description: error.message || 'System error occurred',
          });
          setDialogOpen(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!config) return null;

  return (
    <>
      <Card className="border-amber-500/40 shadow-sm bg-amber-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2 text-amber-600 dark:text-amber-400">
                <ScanFace className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-3">
                  AI-Based PPE Detection
                  <Badge
                    variant={isEnabled ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {isEnabled ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1 max-w-[600px]">
                  When mode is configured as <strong>ACTIVE</strong>, vendors are required to perform a camera scan to verify the use of Personal Protective Equipment (PPE) before entering. If <strong>INACTIVE</strong>, the PPE inspection step is skipped and the status is recorded as <em>Skipped</em>.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggle}
                disabled={isPending}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change PPE Detection Configuration?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <span className="block">
                  You are about to{' '}
                  <strong className={pendingValue ? 'text-primary' : 'text-muted-foreground'}>
                    {pendingValue ? 'enable' : 'disable'}
                  </strong>{' '}
                  the AI-based PPE Detection feature.
                </span>
                {!pendingValue && (
                  <span className="block text-destructive font-medium">
                    Warning: Vendors will no longer be required to scan PPE. PPE status will be <em>Skipped</em> on every check-in.
                  </span>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Change Configuration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
