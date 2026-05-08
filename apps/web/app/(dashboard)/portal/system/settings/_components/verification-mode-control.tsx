'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, Loader2 } from 'lucide-react';
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

export function VerificationModeControl() {
  const { data, isLoading } = useSystemConfigs({ search: 'VERIFICATION_MODE_ENABLED' });
  const { mutate: updateConfig, isPending } = useUpdateSystemConfig();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  // Cari config dengan key yang tepat
  const config = data?.data?.find((c) => c.config_key === 'VERIFICATION_MODE_ENABLED');
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
            `Staff Verification Mode successfully ${pendingValue ? 'enabled' : 'disabled'}.`
          );
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error('Failed to change verification mode', {
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
        <CardContent className="flex items-center justify-center h-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Jika config belum di-seed, kita tidak bisa menampilkan toggle-nya
  if (!config) {
    return null;
  }

  return (
    <>
      <Card className="border-primary/50 shadow-sm bg-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-3">
                  Staff Verification Mode
                  <Badge variant={isEnabled ? 'default' : 'secondary'} className="ml-2">
                    {isEnabled ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1 max-w-[600px]">
                  When mode is configured as <strong>ACTIVE</strong>, all vendor check-ins must undergo manual approval by staff in the Queue Monitoring menu. If <strong>INACTIVE</strong>, vendor arrivals will directly become ACTIVE status (Self-Service).
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggle}
                disabled={isPending}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Verification Mode?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                You are about to change Staff Verification Mode to{' '}
                <strong className={pendingValue ? 'text-primary' : 'text-muted-foreground'}>
                  {pendingValue ? 'ACTIVE' : 'INACTIVE'}
                </strong>.
              </span>
              <span className="block text-destructive font-medium mt-2">
                Warning: This change will immediately impact the operational vendor check-in flow in real-time.
              </span>
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
              Yes, Change Mode
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
