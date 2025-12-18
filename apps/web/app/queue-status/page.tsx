'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import {
  Search,
  Loader2,
  RefreshCw,
  QrCode,
  Building2,
  User,
  Clock,
  Hourglass,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import IconLabel from '@/components/icon-label';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  queueSearchSchema,
  type QueueStatusData,
  type QueueSearch,
} from '@repo/types';

export default function QueueStatusPage() {
  const router = useRouter();
  const [result, setResult] = useState<QueueStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      queueNumber: '',
    },
    validators: {
      onSubmit: queueSearchSchema,
    },
    onSubmit: async ({ value }) => {
      await handleCheckStatus(value);
    },
  });

  async function handleCheckStatus(data: QueueSearch) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // TODO: Replace with actual API call to /api/checkins/status/{queueNumber}
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response for now
      // Logic for demo: if queueNumber ends with '9', return not found
      if (data.queueNumber.endsWith('9')) {
        throw new Error('Nomor antrean tidak ditemukan');
      }

      setResult({
        queueNumber: data.queueNumber,
        status: 'WAITING',
        statusDisplayText: 'Menunggu Verifikasi',
        updatedAt: new Date().toISOString(),
        companyName: 'PT. Toyota Motor Manufacturing Indonesia',
        driverName: 'Budi Santoso',
        submissionTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
        estimatedWaitTime: '15-30 Menit',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'REJECTED':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'WAITING':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="gap-2 hover:bg-transparent pl-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="font-bold text-3xl tracking-tight">
          Cek Status Antrean
        </h1>
        <p className="text-muted-foreground">
          Masukkan nomor antrean Anda untuk melihat status terkini
        </p>
      </div>

      <Card className="bg-background/60 shadow-xl backdrop-blur-md border-muted/20">
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="queueNumber"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <IconLabel
                        classNameIcon="w-6 h-6"
                        htmlFor="queueNumber"
                        icon={QrCode}
                        required
                      >
                        Nomor Antrean
                      </IconLabel>
                      <div className="relative">
                        <Search className="top-2.5 left-3 z-10 absolute w-5 h-5 text-muted-foreground" />
                        <Input
                          placeholder="Contoh: 20251212-001"
                          className="bg-background/80 pl-10 h-12 text-lg vendor-text"
                          id="queueNumber"
                          type="text"
                          autoComplete="off"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <Button
                type="submit"
                className="mt-4 w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Mengecek...
                  </>
                ) : (
                  'Cek Status'
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-500/5 slide-in-from-top-2 border-red-500/20 animate-in fade-in">
          <CardContent className="pt-6 font-medium text-red-600 text-center">
            {error}
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="bg-card/60 slide-in-from-top-4 border-primary/20 overflow-hidden animate-in fade-in">
          <div className="top-0 absolute inset-x-0 bg-linear-to-r from-transparent via-primary/50 to-transparent h-1" />

          <CardHeader className="bg-muted/20 pb-6 border-border/40 border-b text-center">
            <CardDescription className="mb-2 font-semibold text-primary text-xs uppercase tracking-wider">
              Status Antrean Anda
            </CardDescription>
            <CardTitle className="font-mono font-bold text-foreground text-4xl sm:text-5xl tracking-tighter">
              {result.queueNumber}
            </CardTitle>
            <div className="flex justify-center pt-4">
              <div
                className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-semibold shadow-sm ${getStatusColor(
                  result.status,
                )}`}
              >
                {result.statusDisplayText}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-1 bg-muted/30 p-4 rounded-xl">
                <div className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  <Building2 className="mr-2 w-3.5 h-3.5" />
                  Perusahaan
                </div>
                <div className="font-medium text-foreground text-lg wrap-break-word leading-snug">
                  {result.companyName}
                </div>
              </div>

              <div className="space-y-1 bg-muted/30 p-4 rounded-xl">
                <div className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  <User className="mr-2 w-3.5 h-3.5" />
                  Driver
                </div>
                <div className="font-medium text-foreground text-lg wrap-break-word leading-snug">
                  {result.driverName}
                </div>
              </div>

              <div className="space-y-1 bg-muted/30 p-4 rounded-xl">
                <div className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  <Clock className="mr-2 w-3.5 h-3.5" />
                  Waktu Submit
                </div>
                <div className="font-medium text-foreground text-base">
                  {result.submissionTime
                    ? new Date(result.submissionTime).toLocaleString('id-ID', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      })
                    : '-'}
                </div>
              </div>

              {result.estimatedWaitTime && (
                <div className="space-y-1 bg-muted/30 p-4 rounded-xl">
                  <div className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    <Hourglass className="mr-2 w-3.5 h-3.5" />
                    Estimasi Tunggu
                  </div>
                  <div className="font-medium text-foreground text-base">
                    {result.estimatedWaitTime}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 pt-6 border-border/40 border-t">
              <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
                <div className="text-muted-foreground text-xs italic">
                  *Terakhir diperbarui:{' '}
                  {new Date(result.updatedAt).toLocaleTimeString('id-ID')}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={form.handleSubmit}
                  className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="mr-2 w-3.5 h-3.5" />
                  Refresh Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
