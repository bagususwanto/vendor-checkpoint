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
            `Deteksi APD AI berhasil di${pendingValue ? 'aktifkan' : 'nonaktifkan'}.`
          );
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error('Gagal mengubah konfigurasi deteksi APD', {
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
                  Deteksi APD berbasis AI
                  <Badge
                    variant={isEnabled ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {isEnabled ? 'AKTIF' : 'NON-AKTIF'}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1 max-w-[600px]">
                  Saat mode dikonfigurasi sebagai <strong>AKTIF</strong>, vendor diwajibkan melakukan scan kamera untuk verifikasi pemakaian Alat Pelindung Diri (APD) sebelum masuk. Jika <strong>NON-AKTIF</strong>, Step pemeriksaan APD dilewati dan status dicatat sebagai <em>Skipped</em>.
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
            <AlertDialogTitle>Ubah Konfigurasi Deteksi APD?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <span className="block">
                  Anda akan{' '}
                  <strong className={pendingValue ? 'text-primary' : 'text-muted-foreground'}>
                    {pendingValue ? 'mengaktifkan' : 'menonaktifkan'}
                  </strong>{' '}
                  fitur Deteksi APD berbasis AI.
                </span>
                {!pendingValue && (
                  <span className="block text-destructive font-medium">
                    Peringatan: Vendor tidak lagi diwajibkan scan APD. Status APD akan menjadi <em>Skipped</em> pada setiap check-in.
                  </span>
                )}
              </div>
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
              Ya, Ubah Konfigurasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
