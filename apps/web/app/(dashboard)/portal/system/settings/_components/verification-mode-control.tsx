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
            `Mode Verifikasi Staff berhasil di${pendingValue ? 'aktifkan' : 'nonaktifkan'}.`
          );
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error('Gagal mengubah mode verifikasi', {
            description: error.message || 'Terjadi kesalahan sistem',
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
                  Mode Verifikasi Staff
                  <Badge variant={isEnabled ? 'default' : 'secondary'} className="ml-2">
                    {isEnabled ? 'AKTIF' : 'NON-AKTIF'}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1 max-w-[600px]">
                  Saat mode dikonfigurasi sebagai <strong>AKTIF</strong>, semua check-in vendor harus melalui persetujuan manual oleh staff di menu Monitoring Antrean. Jika <strong>NON-AKTIF</strong>, kedatangan vendor akan langsung berstatus AKTIF (Self-Service).
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
            <AlertDialogTitle>Ubah Mode Verifikasi?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Anda akan mengubah Mode Verifikasi Staff menjadi{' '}
                <strong className={pendingValue ? 'text-primary' : 'text-muted-foreground'}>
                  {pendingValue ? 'AKTIF' : 'NON-AKTIF'}
                </strong>.
              </p>
              <p className="text-destructive font-medium mt-2">
                Peringatan: Perubahan ini akan langsung berdampak pada alur operasional check-in vendor secara real-time.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ya, Ubah Mode
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
