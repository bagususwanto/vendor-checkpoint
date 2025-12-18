'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Search, Loader2, RefreshCw, QrCode, Building2, User, Clock, Hourglass, ArrowLeft } from 'lucide-react';
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
import { queueSearchSchema, type QueueStatusData, type QueueSearch } from '@repo/types';

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
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Cek Status Antrean</h1>
        <p className="text-muted-foreground">
          Masukkan nomor antrean Anda untuk melihat status terkini
        </p>
      </div>

      <Card className="backdrop-blur-md bg-background/60 border-muted/20 shadow-xl">
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
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-10" />
                        <Input
                          placeholder="Contoh: 20251212-001"
                          className="pl-10 h-12 text-lg bg-background/80 vendor-text"
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
                className="w-full h-12 text-lg mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
        <Card className="border-red-500/20 bg-red-500/5 animate-in fade-in slide-in-from-top-2">
          <CardContent className="pt-6 text-center text-red-600 font-medium">
            {error}
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-primary/20 bg-card/60 animate-in fade-in slide-in-from-top-4 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <CardHeader className="pb-6 text-center border-b border-border/40 bg-muted/20">
            <CardDescription className="uppercase tracking-wider text-xs font-semibold text-primary mb-2">
              Status Antrean Anda
            </CardDescription>
            <CardTitle className="text-4xl sm:text-5xl font-mono font-bold tracking-tighter text-foreground">
              {result.queueNumber}
            </CardTitle>
            <div className="pt-4 flex justify-center">
              <div
                className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-semibold shadow-sm ${getStatusColor(
                  result.status
                )}`}
              >
                {result.statusDisplayText}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl space-y-1">
                <div className="flex items-center text-muted-foreground text-xs uppercase tracking-wide font-medium">
                  <Building2 className="w-3.5 h-3.5 mr-2" />
                  Perusahaan
                </div>
                <div className="font-medium text-foreground text-lg leading-snug break-words">
                  {result.companyName}
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl space-y-1">
                <div className="flex items-center text-muted-foreground text-xs uppercase tracking-wide font-medium">
                  <User className="w-3.5 h-3.5 mr-2" />
                  Driver
                </div>
                <div className="font-medium text-foreground text-lg leading-snug break-words">
                  {result.driverName}
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-xl space-y-1">
                <div className="flex items-center text-muted-foreground text-xs uppercase tracking-wide font-medium">
                  <Clock className="w-3.5 h-3.5 mr-2" />
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
                <div className="bg-muted/30 p-4 rounded-xl space-y-1">
                  <div className="flex items-center text-muted-foreground text-xs uppercase tracking-wide font-medium">
                    <Hourglass className="w-3.5 h-3.5 mr-2" />
                    Estimasi Tunggu
                  </div>
                  <div className="font-medium text-foreground text-base">
                    {result.estimatedWaitTime}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 mt-2 border-t border-border/40">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground italic">
                  *Terakhir diperbarui: {new Date(result.updatedAt).toLocaleTimeString('id-ID')}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={form.handleSubmit}
                  className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
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
