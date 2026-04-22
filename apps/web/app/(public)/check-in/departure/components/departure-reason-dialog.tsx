'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDelayReasons } from '@/hooks/api/use-delay-reasons';

interface DepartureReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { departure_status: string; delay_departure_reason_id?: number }) => void;
  isSubmitting: boolean;
  detectedStatus?: 'On-Time' | 'Overdue';
}

export function DepartureReasonDialog({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  detectedStatus = 'On-Time',
}: DepartureReasonDialogProps) {
  const [departureStatus, setDepartureStatus] = useState<string>(detectedStatus);
  const [selectedReasonId, setSelectedReasonId] = useState<number | undefined>();

  useEffect(() => {
    if (isOpen) {
      setDepartureStatus(detectedStatus);
      setSelectedReasonId(undefined);
    }
  }, [isOpen, detectedStatus]);

  // Use the hook to fetch the departure reasons from the backend
  const { data: delayReasonsData, isLoading } = useDelayReasons({ category: 'Departure', limit: 100 });

  const delayReasons = delayReasonsData?.data?.filter((r) => r.is_active) ?? [];

  const handleConfirm = () => {
    onConfirm({
      departure_status: departureStatus,
      delay_departure_reason_id: departureStatus === 'Overdue' ? selectedReasonId : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Check-Out</DialogTitle>
          <DialogDescription>
            {detectedStatus === 'Overdue'
              ? 'Status keberangkatan Anda terdeteksi Overdue (Molor). Mohon sertakan alasannya.'
              : 'Pilih status keberangkatan Anda. Jika jadwal Anda molor/Overdue dari target, mohon sertakan alasannya.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Status Keberangkatan</Label>
            <RadioGroup
              value={departureStatus}
              onValueChange={(val) => {
                setDepartureStatus(val);
                if (val !== 'Overdue') {
                  setSelectedReasonId(undefined);
                }
              }}
              className="flex flex-col gap-3"
            >
              <div
                className={`flex items-center space-x-2 border p-3 rounded-lg ${
                  detectedStatus === 'Overdue'
                    ? 'opacity-50 bg-slate-100 cursor-not-allowed'
                    : 'hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <RadioGroupItem
                  value="On-Time"
                  id="status-ontime"
                  disabled={detectedStatus === 'Overdue'}
                />
                <Label
                  htmlFor="status-ontime"
                  className={`flex-1 font-medium text-emerald-700 ${
                    detectedStatus === 'Overdue' ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  On-Time (Sesuai Target)
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer bg-slate-50">
                <RadioGroupItem value="Overdue" id="status-overdue" />
                <Label htmlFor="status-overdue" className="flex-1 cursor-pointer font-medium text-amber-700">
                  Overdue (Molor)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {departureStatus === 'Overdue' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Label className="text-sm font-semibold">Alasan Keterlambatan</Label>
              <div className="p-3 border rounded-lg bg-orange-50/50">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Memuat opsi alasan...</p>
                ) : delayReasons.length === 0 ? (
                  <p className="text-sm text-amber-600">Terjadi kesalahan, opsi alasan kosong.</p>
                ) : (
                  <RadioGroup
                    value={selectedReasonId?.toString() || ''}
                    onValueChange={(val) => setSelectedReasonId(Number(val))}
                    className="flex flex-col gap-2"
                  >
                    {delayReasons.map((reason: import('@repo/types').DelayReasonResponse) => (
                      <div key={reason.delay_reason_id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={reason.delay_reason_id.toString()}
                          id={`reason-${reason.delay_reason_id}`}
                        />
                        <Label htmlFor={`reason-${reason.delay_reason_id}`} className="cursor-pointer text-sm">
                          {reason.reason_text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || (departureStatus === 'Overdue' && !selectedReasonId)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? 'Memproses...' : 'Selesai & Keluar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
