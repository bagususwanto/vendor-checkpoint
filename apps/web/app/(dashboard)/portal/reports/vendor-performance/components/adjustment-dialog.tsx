'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createAdjustmentSchema,
  CreateAdjustmentPayload,
  ArrivalStatus,
  DepartureStatus,
} from '@repo/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateAdjustment } from '@/hooks/api/use-performance-adjustment';
import { Loader2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from '@/components/ui/field';

interface AdjustmentDialogProps {
  entry: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AdjustmentDialog({
  entry,
  isOpen,
  onClose,
}: AdjustmentDialogProps) {
  const createAdjustment = useCreateAdjustment();

  const form = useForm<CreateAdjustmentPayload>({
    resolver: zodResolver(createAdjustmentSchema),
    defaultValues: {
      entry_id: entry?.entry_id,
      adjusted_arrival_status: entry?.arrival_status,
      adjusted_departure_status: entry?.departure_status,
      adjusted_ppe_compliant: entry?.is_compliant,
      adjustment_reason: '',
    },
  });

  React.useEffect(() => {
    if (entry && isOpen) {
      form.reset({
        entry_id: entry.entry_id,
        adjusted_arrival_status: entry.arrival_status,
        adjusted_departure_status: entry.departure_status,
        adjusted_ppe_compliant: entry.is_compliant,
        adjustment_reason: '',
      });
    }
  }, [entry, isOpen, form]);

  const onSubmit = async (data: CreateAdjustmentPayload) => {
    await createAdjustment.mutateAsync(data);
    onClose();
  };

  if (!entry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sesuaikan Performa Vendor</DialogTitle>
          <DialogDescription>
            Lakukan penyesuaian metrik performa untuk Queue{' '}
            <strong>#{entry.queue_number}</strong>. Data asli tidak akan diubah,
            hanya ditimpa pada laporan.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Arrival Status</FieldLabel>
              <FieldContent>
                <Select
                  onValueChange={(val) => form.setValue('adjusted_arrival_status', val)}
                  value={form.watch('adjusted_arrival_status')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ArrivalStatus.ON_TIME}>
                      On-Time
                    </SelectItem>
                    <SelectItem value={ArrivalStatus.LATE}>Late</SelectItem>
                    <SelectItem value={ArrivalStatus.EARLY}>
                      Early
                    </SelectItem>
                    <SelectItem value="Unscheduled">Unscheduled</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
              <FieldError errors={[form.formState.errors.adjusted_arrival_status]} />
            </Field>

            <Field>
              <FieldLabel>Departure Status</FieldLabel>
              <FieldContent>
                <Select
                  onValueChange={(val) => form.setValue('adjusted_departure_status', val)}
                  value={form.watch('adjusted_departure_status') || undefined}
                  disabled={!entry.ops_timelog?.is_checked_out}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DepartureStatus.ON_TIME}>
                      On-Time
                    </SelectItem>
                    <SelectItem value={DepartureStatus.OVERDUE}>
                      Overdue
                    </SelectItem>
                    <SelectItem value="Unscheduled">Unscheduled</SelectItem>
                  </SelectContent>
                </Select>
                {!entry.ops_timelog?.is_checked_out && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Belum check-out
                  </p>
                )}
              </FieldContent>
              <FieldError errors={[form.formState.errors.adjusted_departure_status]} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>PPE Compliance</FieldLabel>
              <FieldContent>
                <Select
                  onValueChange={(val) => form.setValue('adjusted_ppe_compliant', val === 'true')}
                  value={form.watch('adjusted_ppe_compliant')?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Compliant (Patuh)</SelectItem>
                    <SelectItem value="false">
                      Non-Compliant (Melanggar)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
              <FieldError errors={[form.formState.errors.adjusted_ppe_compliant]} />
            </Field>

            <Field>
              <FieldLabel>Overall Safety</FieldLabel>
              <FieldContent>
                <Select
                  onValueChange={(val) => form.setValue('override_has_non_compliant', val === 'true')}
                  value={form.watch('override_has_non_compliant')?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Safe (Lolos)</SelectItem>
                    <SelectItem value="true">Unsafe (Temuan)</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
              <FieldError errors={[form.formState.errors.override_has_non_compliant]} />
            </Field>
          </div>

          <Separator />

          <Field>
            <FieldLabel required>
              Alasan Penyesuaian
            </FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Contoh: Koreksi hasil scan AI yang salah karena pencahayaan, atau keterlambatan input manual oleh staff."
                className="resize-none"
                {...form.register('adjustment_reason')}
              />
            </FieldContent>
            <FieldError errors={[form.formState.errors.adjustment_reason]} />
          </Field>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800">
              Setiap penyesuaian akan dicatat dalam log audit. Pastikan alasan
              yang diberikan jelas dan dapat dipertanggungjawabkan.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createAdjustment.isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={createAdjustment.isPending}>
              {createAdjustment.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Simpan Penyesuaian
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
