'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Search, LogOut } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import IconLabel from '@/components/icon-label';

import { useQueueStatus, useCheckoutCheckIn } from '@/hooks/api/use-check-in';
import { DepartureReasonDialog } from './components/departure-reason-dialog';

const SearchSchema = z.object({
  queueNumber: z.string().min(1, 'Masukkan nomor antrean!'),
});

export default function DeparturePage() {
  const router = useRouter();
  const [searchedQueue, setSearchedQueue] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // APIs
  const { data: queueData, isFetching: isSearching, refetch } = useQueueStatus(
    searchedQueue || '',
  );
  const { mutateAsync: checkout, isPending: isCheckingOut } = useCheckoutCheckIn();

  const form = useForm({
    defaultValues: {
      queueNumber: '',
    },
    validators: {
      onSubmit: SearchSchema,
    },
    onSubmit: async ({ value }) => {
      setSearchedQueue(value.queueNumber.trim().toUpperCase());
      setTimeout(() => {
        refetch();
      }, 0);
    },
  });

  const handleCheckoutClick = () => {
    // For now, always assume we might need a delay reason, or show the dialog
    // A better approach is to ask backend if it's overdue, but since we don't have this,
    // let's show the dialog right away, and if they are on-time, they just click "Submit" without reason?
    // Let's always open the Departure Reason Dialog for confirmation.
    setIsDialogOpen(true);
  };

  const handleConfirmCheckout = async (payload: {
    departure_status: string;
    delay_departure_reason_id?: number;
  }) => {
    if (!queueData) return;

    try {
      await checkout({
        queue_number: queueData.queue_number,
        departure_status: payload.departure_status,
        delay_departure_reason_id: payload.delay_departure_reason_id,
      });

      toast.success('Keberangkatan Berhasil', {
        description: 'Terima kasih atas kunjungannya.',
      });
      setIsDialogOpen(false);
      setSearchedQueue(null);
      form.reset();
    } catch (error) {
      toast.error('Gagal memproses keberangkatan', {
        description: 'Periksa kembali nomor antrean Anda.',
      });
    }
  };

  return (
    <div className="container min-h-screen py-12 px-4 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Departure Scan</CardTitle>
          <CardDescription>
            Pindai barcode antrean atau ketikkan nomor antrean Anda untuk check-out
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="queueNumber"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <Input
                      className="h-14 text-center text-xl tracking-widest font-bold uppercase transition-all"
                      placeholder="Q-XXX"
                      autoComplete="off"
                      autoFocus
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <Button
              type="submit"
              size="xl"
              className="w-full"
              disabled={isSearching}
            >
              <Search className="w-5 h-5 mr-2" />
              {isSearching ? 'Mencari...' : 'Cari Data'}
            </Button>
          </form>

          {searchedQueue && queueData && (
            <div className="mt-8 p-4 border rounded-xl bg-slate-50 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center border-b pb-4">
                <p className="text-sm text-slate-500 uppercase tracking-widest">
                  Vendor
                </p>
                <h3 className="font-bold text-xl text-slate-900 mt-1">
                  {queueData.snapshot_company_name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-500">Driver</p>
                  <p className="font-medium text-slate-900">{queueData.driver_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status Saat Ini</p>
                  <p className="font-medium text-slate-900">{queueData.current_status}</p>
                </div>
              </div>

              {queueData.current_status === 'SELESAI' ? (
                <div className="pt-4 text-center text-red-500 font-medium">
                  Antrean ini sudah berhasil Check-Out (SELESAI).
                </div>
              ) : queueData.current_status !== 'AKTIF' && queueData.current_status !== 'DISETUJUI' ? (
                <div className="pt-4 text-center text-red-500 font-medium">
                  Antrean ini masih {queueData.current_status}, tidak dapat Checkout.
                </div>
              ) : (
                <Button
                  onClick={handleCheckoutClick}
                  size="xl"
                  variant="default"
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isCheckingOut}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Konfirmasi Check-Out
                </Button>
              )}
            </div>
          )}

          {searchedQueue && !queueData && !isSearching && (
            <div className="mt-8 p-4 text-center text-red-500 bg-red-50 rounded-xl">
              Antrean <b>{searchedQueue}</b> tidak ditemukan.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </CardFooter>
      </Card>

      <DepartureReasonDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmCheckout}
        isSubmitting={isCheckingOut}
      />
    </div>
  );
}
