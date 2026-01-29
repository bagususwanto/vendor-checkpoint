'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Building2,
  Package,
  User,
  Clock,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';
import { useCheckoutCheckIn } from '@/hooks/api/use-check-in';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/lib/utils';

interface CheckinData {
  id: string;
  company: string;
  driver: string;
  category: string;
  time: string;
  status: string;
}

interface CheckoutSheetProps {
  checkin: CheckinData;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CheckoutSheet({
  checkin,
  trigger,
  onSuccess,
}: CheckoutSheetProps) {
  const [open, setOpen] = useState(false);
  const checkoutMutation = useCheckoutCheckIn();

  const handleCheckout = () => {
    checkoutMutation.mutate(checkin.id, {
      onSuccess: () => {
        toast.success('Checkout Berhasil', {
          description: `Driver ${checkin.driver} telah berhasil check-out.`,
        });
        setOpen(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error('Gagal Checkout', {
          description:
            error.message || 'Terjadi kesalahan saat memproses checkout.',
        });
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent className="sm:max-w-xl w-full flex flex-col h-full ring-offset-0 focus-visible:outline-none [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-orange-500" />
              Konfirmasi Check-Out
            </SheetTitle>
            <Badge variant="outline" className="text-base px-3 py-1">
              {checkin.id}
            </Badge>
          </div>
          <SheetDescription>
            Pastikan seluruh proses telah selesai sebelum mengizinkan driver
            keluar.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-lg border border-orange-100 text-orange-800">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm">
                Tindakan ini akan menyelesaikan sesi kunjungan driver ini di
                area perusahaan.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                Identitas Pengirim
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 shadow-sm col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Perusahaan
                      </p>
                      <p className="font-semibold">{checkin.company}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Driver
                      </p>
                      <p className="font-semibold text-sm truncate w-[140px]">
                        {checkin.driver}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Kategori
                      </p>
                      <p className="font-semibold text-sm">
                        {checkin.category}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                Ringkasan Waktu
              </h4>
              <Card className="p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Check-In
                    </p>
                    <p className="font-semibold text-base">
                      {checkin.time
                        ? formatDateTime(checkin.time, 'dd MMMM yyyy, HH:mm')
                        : '-'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-auto pt-4 border-t">
          <Button
            size="lg"
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending}
          >
            {checkoutMutation.isPending ? 'Memproses...' : 'Proses Check-Out'}
          </Button>
          <SheetClose asChild>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto mt-2 sm:mt-0"
            >
              Batal
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
