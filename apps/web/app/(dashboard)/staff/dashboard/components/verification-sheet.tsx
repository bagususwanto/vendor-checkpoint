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
} from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

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
}: VerificationSheetProps) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');

  return (
    <Sheet>
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
                          {checkin.company}
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
                          {checkin.category}
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
                          {checkin.driver}
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
                          {checkin.time}
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

                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Perhatian</AlertTitle>
                  <AlertDescription>2 item jawab TIDAK</AlertDescription>
                </Alert>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full border rounded-lg bg-card"
                >
                  <AccordionItem value="safety" className="border-b">
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                      <div className="flex w-full items-center justify-between pr-2">
                        <span className="font-medium">Safety & K3</span>
                        <Badge variant="destructive" className="rounded-sm">
                          1 Tidak
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2">
                      <ul className="space-y-3 pt-2">
                        <li className="flex items-center gap-3 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          <span className="text-muted-foreground">
                            Helm Safety
                          </span>
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          <span className="text-muted-foreground">
                            Rompi Safety
                          </span>
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                          <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                          <span className="font-medium text-red-600">
                            Sepatu Safety (Tidak Tersedia)
                          </span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="quality" className="border-none">
                    <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                      <div className="flex w-full items-center justify-between pr-2">
                        <span className="font-medium">Quality Control</span>
                        <Badge variant="destructive" className="rounded-sm">
                          1 Tidak
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2">
                      <ul className="space-y-3 pt-2">
                        <li className="flex items-center gap-3 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          <span className="text-muted-foreground">
                            Kondisi Material
                          </span>
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                          <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                          <span className="font-medium text-red-600">
                            Dokumen Jalan (Tidak Lengkap)
                          </span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
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
                  onValueChange={(v) => setDecision(v as 'approve' | 'reject')}
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
        </div>

        <SheetFooter className="mt-auto">
          <Button
            disabled={decision === 'reject' && !reason}
            onClick={() => console.log({ decision, reason })}
          >
            Simpan
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Batal</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
