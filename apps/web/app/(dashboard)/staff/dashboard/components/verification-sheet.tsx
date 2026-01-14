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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building2,
  Package,
  User,
  Clock,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  useVerifyCheckIn,
  useVerificationDetail,
} from '@/hooks/api/use-check-in';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { icons } from 'lucide-react';

interface CheckinData {
  id: string;
  company: string;
  driver: string;
  category: string;
  time: string;
  status: string;
}

interface VerificationSheetProps {
  checkin: CheckinData;
  trigger?: React.ReactNode;
}

export function VerificationSheet({
  checkin,
  trigger,
  onSuccess,
}: VerificationSheetProps & { onSuccess?: () => void }) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);

  // Fetch detail data
  const { data: detailData, isLoading } = useVerificationDetail(
    open ? checkin.id : '',
  );
  const verifyMutation = useVerifyCheckIn();

  const handleSave = () => {
    if (!decision) return;

    verifyMutation.mutate(
      {
        id: checkin.id,
        payload: {
          status: decision === 'approve' ? 'APPROVED' : 'REJECTED',
          note: reason,
        },
      },
      {
        onSuccess: () => {
          toast.success('Verifikasi Berhasil', {
            description: `Check-in telah berhasil di-${decision === 'approve' ? 'setujui' : 'tolak'}.`,
          });
          setOpen(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error('Gagal Verifikasi', {
            description:
              error.message || 'Terjadi kesalahan saat menyimpan verifikasi.',
          });
        },
      },
    );
  };

  // Calculate non-compliant items count
  const nonCompliantCount =
    detailData?.checklist_responses?.reduce(
      (acc: number, category: any) =>
        acc + category.items.filter((item: any) => !item.is_compliant).length,
      0,
    ) || 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent className="sm:max-w-2xl w-full flex flex-col h-full ring-offset-0 focus-visible:outline-none [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Verifikasi Check-in</SheetTitle>
            <Badge variant="outline" className="text-base px-3 py-1">
              {checkin.id}
            </Badge>
          </div>
          <SheetDescription>
            Tinjau detail dan berikan keputusan verifikasi.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : detailData ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
              <div className="space-y-6">
                <div>
                  <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                    Identitas Pengirim
                  </h4>
                  <div className="space-y-4">
                    <Card className="p-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Perusahaan
                          </p>
                          <p className="font-semibold text-base">
                            {detailData.snapshot_company_name}
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
                            Kategori Material
                          </p>
                          <p className="font-semibold text-base">
                            {detailData.snapshot_category_name}
                          </p>
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
                          <p className="font-semibold text-base">
                            {detailData.driver_name}
                          </p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Waktu Submit
                          </p>
                          <p className="font-semibold text-base">
                            {detailData.submission_time
                              ? format(
                                  new Date(detailData.submission_time),
                                  'dd MMMM yyyy, HH:mm',
                                  { locale: localeId },
                                )
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Checklist */}
                <div>
                  <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                    Pemeriksaan
                  </h4>

                  {nonCompliantCount > 0 && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Perhatian</AlertTitle>
                      <AlertDescription>
                        {nonCompliantCount} item tidak memenuhi standar
                      </AlertDescription>
                    </Alert>
                  )}

                  <Accordion
                    type="single"
                    collapsible
                    className="w-full border rounded-lg bg-card"
                  >
                    {detailData.checklist_responses?.map(
                      (category: any, index: number) => {
                        const CategoryIcon =
                          icons[category.icon_name as keyof typeof icons] ||
                          icons.Activity;
                        const categoryNonCompliantCount = category.items.filter(
                          (item: any) => !item.is_compliant,
                        ).length;

                        return (
                          <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className={
                              index ===
                              detailData.checklist_responses.length - 1
                                ? 'border-none'
                                : 'border-b'
                            }
                          >
                            <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                              <div className="flex w-full items-center justify-between pr-2">
                                <div className="flex items-center gap-2">
                                  <CategoryIcon
                                    className={`h-4 w-4 ${category.color_code}`}
                                  />
                                  <span className="font-medium">
                                    {category.category_name}
                                  </span>
                                </div>
                                {categoryNonCompliantCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="rounded-sm"
                                  >
                                    {categoryNonCompliantCount} Tidak
                                  </Badge>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-0 pb-0">
                              <div className="divide-y">
                                {category.items.map(
                                  (item: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="flex items-start justify-between gap-4 p-4 hover:bg-muted/30 transition-colors"
                                    >
                                      <div className="space-y-1">
                                        <p
                                          className={`text-sm ${
                                            !item.is_compliant
                                              ? 'font-medium text-destructive'
                                              : 'text-foreground'
                                          }`}
                                        >
                                          {item.item_text_snapshot}
                                        </p>
                                        {!item.is_compliant && (
                                          <p className="text-xs text-muted-foreground">
                                            Item ini memerlukan perhatian
                                            khusus.
                                          </p>
                                        )}
                                      </div>
                                      <div className="shrink-0">
                                        {item.response_value ? (
                                          <Badge
                                            variant={
                                              item.is_compliant
                                                ? 'outline'
                                                : 'destructive'
                                            }
                                            className={`${
                                              item.is_compliant
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                                                : ''
                                            }`}
                                          >
                                            {item.is_compliant ? (
                                              <CheckCircle className="mr-1 h-3 w-3" />
                                            ) : (
                                              <XCircle className="mr-1 h-3 w-3" />
                                            )}
                                            Ya
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant={
                                              item.is_compliant
                                                ? 'outline'
                                                : 'destructive'
                                            }
                                            className={`${
                                              item.is_compliant
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                                                : ''
                                            }`}
                                          >
                                            {item.is_compliant ? (
                                              <CheckCircle className="mr-1 h-3 w-3" />
                                            ) : (
                                              <XCircle className="mr-1 h-3 w-3" />
                                            )}
                                            Tidak
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      },
                    )}
                  </Accordion>
                </div>

                <Separator />

                {/* Keputusan */}
                <div>
                  <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                    Keputusan Akhir
                  </h4>
                  <RadioGroup
                    value={decision || ''}
                    onValueChange={(v) =>
                      setDecision(v as 'approve' | 'reject')
                    }
                    className="grid gap-3"
                  >
                    <div>
                      <RadioGroupItem
                        value="approve"
                        id="approve"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="approve"
                        className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <div className="flex w-full items-center gap-3">
                          <div className="rounded-full bg-green-100 p-1 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Setujui</p>
                            <p className="text-xs text-muted-foreground">
                              Lanjutkan proses
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="reject"
                        id="reject"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="reject"
                        className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/5 cursor-pointer transition-all"
                      >
                        <div className="flex w-full items-center gap-3">
                          <div className="rounded-full bg-red-100 p-1 text-red-600">
                            <XCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Tolak</p>
                            <p className="text-xs text-muted-foreground">
                              Hentikan proses
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {decision === 'reject' && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="reason" className="sr-only">
                        Alasan Penolakan
                      </Label>
                      <textarea
                        id="reason"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tuliskan alasan penolakan di sini..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Gagal memuat data verifikasi.
            </div>
          )}
        </div>

        <SheetFooter className="mt-auto">
          <Button
            disabled={
              !decision ||
              (decision === 'reject' && !reason) ||
              verifyMutation.isPending
            }
            onClick={handleSave}
          >
            {verifyMutation.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Batal</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
