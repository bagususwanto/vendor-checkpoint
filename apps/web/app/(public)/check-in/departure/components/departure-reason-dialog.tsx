'use client';

import { useState } from 'react';
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
}

export function DepartureReasonDialog({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: DepartureReasonDialogProps) {
  const [departureStatus, setDepartureStatus] = useState<string>('On-Time');
  const [selectedReasonId, setSelectedReasonId] = useState<number | undefined>();

  // Use the hook to fetch the departure reasons from the backend
  const { data: delayReasonsData, isLoading } = useDelayReasons({ category: 'Departure', isActive: true });

  const delayReasons = Array.isArray(delayReasonsData) ? delayReasonsData : delayReasonsData?.data || [];

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
            Pilih status keberangkatan Anda. Jika jadwal Anda molor/Overdue dari target, mohon sertakan alasannya.
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
              <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                <RadioGroupItem value="On-Time" id="status-ontime" />
                <Label htmlFor="status-ontime" className="flex-1 cursor-pointer font-medium text-emerald-700">
                  On-Time (Sesuai Target)
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
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
