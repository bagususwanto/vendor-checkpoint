'use client';

import { StatusBadge } from '../../../components/status-badge';
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
  Clock,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Maximize2,
  User,
  Package,
  Building2,
} from 'lucide-react';
import { useState, Fragment } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  useVerifyCheckIn,
  useVerificationDetail,
  useUploadDiscrepancyImage,
  useSubmitDiscrepancy,
} from '@/hooks/api/use-check-in';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';
import { icons, Camera, ImagePlus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  readonly?: boolean;
}

export function VerificationSheet({
  checkin,
  trigger,
  onSuccess,
  readonly = false,
}: VerificationSheetProps & { onSuccess?: () => void }) {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);

  // Fetch detail data
  const { data: detailData, isLoading } = useVerificationDetail(
    open ? checkin.id : '',
  );
  const verifyMutation = useVerifyCheckIn();
  const uploadImageMutation = useUploadDiscrepancyImage();
  const submitDiscrepancyMutation = useSubmitDiscrepancy();

  // State for officer discrepancies
  const [officerFindings, setOfficerFindings] = useState<
    Record<
      number,
      { marked: boolean; note: string; imagePath?: string; item_text: string }
    >
  >({});

  const handleToggleFinding = (responseId: number, itemText: string) => {
    setOfficerFindings((prev) => {
      const current = prev[responseId];
      if (current?.marked) {
        // If unmarking, remove from state
        const newState = { ...prev };
        delete newState[responseId];
        return newState;
      }
      return {
        ...prev,
        [responseId]: { marked: true, note: '', item_text: itemText },
      };
    });
  };

  const handleUpdateNote = (responseId: number, note: string) => {
    setOfficerFindings((prev) => {
      const current = prev[responseId];
      if (!current) return prev;
      return {
        ...prev,
        [responseId]: { ...current, note },
      };
    });
  };

  const handleUploadImage = async (responseId: number, file: File) => {
    try {
      const result = await uploadImageMutation.mutateAsync(file);
      setOfficerFindings((prev) => {
        const current = prev[responseId];
        if (!current) return prev;
        return {
          ...prev,
          [responseId]: { ...current, imagePath: result.image_path },
        };
      });
      toast.success('Foto bukti berhasil diunggah');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengunggah foto bukti';
      toast.error(message);
    }
  };

  const handleSave = async () => {
    if (!decision) return;

    try {
      // 1. Submit discrepancies if any
      const findingsArray = Object.entries(officerFindings)
        .filter(([_, val]) => val.marked)
        .map(([respId, val]) => ({
          response_id: parseInt(respId),
          item_text_snapshot: val.item_text,
          officer_note: val.note,
          evidence_image_path: val.imagePath,
        }));

      if (findingsArray.length > 0) {
        await submitDiscrepancyMutation.mutateAsync({
          queue_number: checkin.id,
          discrepancies: findingsArray,
        });
      }

      // 2. Submit verification
      verifyMutation.mutate(
        {
          queue_number: checkin.id,
          action: decision === 'approve' ? 'APPROVE' : 'REJECT',
          rejection_reason: reason,
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
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Terjadi kesalahan saat menyimpan catatan ketidaksesuaian.';
      toast.error('Gagal menyimpan temuan', {
        description: message,
      });
    }
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
            <SheetTitle>
              {readonly ? 'Detail Check-in' : 'Verifikasi Check-in'}
            </SheetTitle>
            <Badge variant="outline" className="text-base px-3 py-1">
              {checkin.id}
            </Badge>
          </div>
          <SheetDescription>
            {readonly
              ? 'Informasi detail check-in dan riwayat verifikasi.'
              : 'Tinjau detail dan berikan keputusan verifikasi.'}
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
                            Kategori Vendor
                          </p>
                          <p className="font-semibold text-base">
                            {detailData.snapshot_category_name}
                          </p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-status-info-bg p-2 text-status-info-fg">
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
                              ? formatDateTime(
                                  detailData.submission_time,
                                  'dd MMMM yyyy, HH:mm',
                                )
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* V2 Additions */}
                    <Card className="p-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                DN / PO Number
                              </p>
                              <p className="font-semibold text-base">
                                {detailData.dn_number || '-'} /{' '}
                                {detailData.po_number || '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 shadow-sm h-full">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Arrival Status
                          </p>
                          {detailData.arrival_status ? (
                            <Badge
                              variant={
                                detailData.arrival_status === 'Late'
                                  ? 'destructive'
                                  : detailData.arrival_status === 'Early'
                                    ? 'secondary'
                                    : detailData.arrival_status ===
                                        'Unscheduled'
                                      ? 'outline'
                                      : 'default'
                              }
                              className="mt-1"
                            >
                              {detailData.arrival_status}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </div>
                      </Card>

                      <Card className="p-4 shadow-sm h-full">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            AI Verification
                          </p>
                          {detailData.ai_safety_status ? (
                            <Badge
                              variant={
                                detailData.ai_safety_status === 'Fail'
                                  ? 'destructive'
                                  : detailData.ai_safety_status === 'Pass'
                                    ? 'default'
                                    : 'outline'
                              }
                              className="mt-1"
                            >
                              {detailData.ai_safety_status}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </div>
                      </Card>
                    </div>

                    {detailData.ops_ppe_scan && (
                      <Card
                        className={`overflow-hidden border-2 transition-all ${
                          detailData.ops_ppe_scan.is_compliant
                            ? 'border-emerald-100 bg-emerald-50/30'
                            : 'border-rose-100 bg-rose-50/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                          <div className="p-4 flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              {detailData.ops_ppe_scan.is_compliant ? (
                                <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-600">
                                  <ShieldCheck className="h-4 w-4" />
                                </div>
                              ) : (
                                <div className="p-1.5 rounded-full bg-rose-100 text-rose-600">
                                  <ShieldAlert className="h-4 w-4" />
                                </div>
                              )}
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                PPE Scan Analysis
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase ${
                                    detailData.ops_ppe_scan.is_compliant
                                      ? 'bg-emerald-600 hover:bg-emerald-700'
                                      : 'bg-rose-600 hover:bg-rose-700'
                                  }`}
                                >
                                  {detailData.ops_ppe_scan.is_compliant
                                    ? 'Pass'
                                    : 'Fail'}
                                </Badge>
                                <span
                                  className={`text-sm font-semibold ${
                                    detailData.ops_ppe_scan.is_compliant
                                      ? 'text-emerald-700'
                                      : 'text-rose-700'
                                  }`}
                                >
                                  {detailData.ops_ppe_scan.is_compliant
                                    ? 'APD Lengkap'
                                    : 'Atribut Tidak Lengkap'}
                                </span>
                              </div>

                              {!detailData.ops_ppe_scan.is_compliant && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {[
                                    {
                                      key: 'has_hardhat',
                                      label: 'Helm Safety',
                                    },
                                    {
                                      key: 'has_safety_vest',
                                      label: 'Rompi Safety',
                                    },
                                  ].map((item) => (
                                    <Badge
                                      key={item.key}
                                      variant="outline"
                                      className={`text-[10px] py-0 h-5 border-rose-200 ${
                                        !detailData.ops_ppe_scan[item.key]
                                          ? 'bg-rose-100 text-rose-700 font-bold'
                                          : 'bg-transparent text-muted-foreground line-through opacity-50'
                                      }`}
                                    >
                                      {item.label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {detailData.ops_ppe_scan.image_path && (
                            <div className="p-4 bg-muted/20 flex flex-col items-center justify-center min-w-[140px]">
                              <div
                                className="group relative h-24 w-24 rounded-lg overflow-hidden border-2 border-white shadow-sm cursor-pointer"
                                onClick={() =>
                                  window.open(
                                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${detailData.ops_ppe_scan.image_path}`,
                                    '_blank',
                                  )
                                }
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${detailData.ops_ppe_scan.image_path}`}
                                  alt="PPE Scan"
                                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Maximize2 className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <span className="text-[10px] font-medium text-muted-foreground mt-2">
                                Bukti Foto Scan
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>

              {/* Log Waktu */}
              {detailData.ops_timelog && (
                <div>
                  <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                    Log Waktu
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Waktu Check-in
                        </p>
                        <p className="font-semibold text-sm">
                          {detailData.ops_timelog.checkin_time
                            ? formatDateTime(
                                detailData.ops_timelog.checkin_time,
                                'dd MMM yyyy, HH:mm',
                              )
                            : '-'}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Waktu Check-out
                        </p>
                        <p className="font-semibold text-sm">
                          {detailData.ops_timelog.checkout_time
                            ? formatDateTime(
                                detailData.ops_timelog.checkout_time,
                                'dd MMM yyyy, HH:mm',
                              )
                            : '-'}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Durasi
                        </p>
                        <p className="font-semibold text-sm">
                          {detailData.ops_timelog.duration_minutes
                            ? `${detailData.ops_timelog.duration_minutes} Menit`
                            : '-'}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Checkout Oleh
                        </p>
                        <p className="font-semibold text-sm">
                          {detailData.ops_timelog.user?.full_name || '-'}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Informasi Verifikasi */}
              {detailData.ops_verification && (
                <div>
                  <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                    Informasi Verifikasi
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Status Verifikasi
                        </p>
                        <StatusBadge
                          status={
                            detailData.ops_verification.verification_status
                          }
                        />
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Diverifikasi Oleh
                        </p>
                        <p className="font-semibold text-sm">
                          {detailData.ops_verification.user?.full_name || '-'}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm col-span-2">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Waktu Verifikasi
                        </p>
                        <p className="font-semibold text-sm">
                          {detailData.ops_verification.verification_time
                            ? formatDateTime(
                                detailData.ops_verification.verification_time,
                                'dd MMM yyyy, HH:mm',
                              )
                            : '-'}
                        </p>
                      </div>
                    </Card>
                    {detailData.ops_verification.rejection_reason && (
                      <Card className="p-4 shadow-sm col-span-2 bg-status-error-bg border-status-error-border">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-destructive">
                            Alasan Penolakan
                          </p>
                          <p className="text-sm text-destructive font-medium">
                            {detailData.ops_verification.rejection_reason}
                          </p>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              )}

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
                                    <Fragment key={idx}>
                                      <div
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
                                        <div className="flex gap-2 mt-1">
                                          {item.item_type && (
                                            <Badge
                                              variant="secondary"
                                              className="text-[10px] px-1.5 py-0 h-5 capitalize"
                                            >
                                              {item.item_type.toLowerCase()}
                                            </Badge>
                                          )}
                                          {item.material_category_name && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] px-1.5 py-0 h-5 text-muted-foreground"
                                            >
                                              {item.material_category_name}
                                            </Badge>
                                          )}
                                          {!item.is_compliant && (
                                            <p className="text-xs text-muted-foreground self-center">
                                              Item ini memerlukan perhatian
                                              khusus.
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="shrink-0 flex items-center gap-3">
                                        {/* Officer Discrepancy Toggle */}
                                        {!readonly && (
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant={
                                                    officerFindings[
                                                      item.response_id
                                                    ]?.marked
                                                      ? 'destructive'
                                                      : 'outline'
                                                  }
                                                  size="icon"
                                                  className={`h-8 w-8 transition-all ${
                                                    officerFindings[
                                                      item.response_id
                                                    ]?.marked
                                                      ? 'ring-2 ring-destructive/20'
                                                      : 'hover:border-destructive hover:text-destructive'
                                                  }`}
                                                  onClick={() =>
                                                    handleToggleFinding(
                                                      item.response_id,
                                                      item.item_text_snapshot,
                                                    )
                                                  }
                                                >
                                                  <AlertTriangle
                                                    className={`h-4 w-4 ${
                                                      officerFindings[
                                                        item.response_id
                                                      ]?.marked
                                                        ? 'animate-pulse'
                                                        : ''
                                                    }`}
                                                  />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>
                                                  Tandai Ketidaksesuaian Fisik
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        )}

                                        {item.response_value ? (
                                          <Badge
                                            variant={
                                              item.is_compliant
                                                ? 'outline'
                                                : 'destructive'
                                            }
                                            className={`${
                                              item.is_compliant
                                                ? 'bg-status-success-bg text-status-success-fg border-status-success-border'
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
                                                ? 'bg-status-success-bg text-status-success-fg border-status-success-border'
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
                                    
                                    {/* Discrepancy Form Overlay */}
                                    {officerFindings[item.response_id]
                                      ?.marked && (
                                      <div className="mx-4 mb-4 mt-0 p-4 rounded-lg bg-destructive/5 border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="flex flex-col gap-3">
                                          <div className="flex items-center gap-2 text-destructive">
                                            <ShieldAlert className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-tight">
                                              Temuan Petugas
                                            </span>
                                          </div>
                                          
                                          <div className="flex gap-4 items-start">
                                            <div className="flex-1 space-y-2">
                                              <Textarea
                                                placeholder="Berikan catatan ketidaksesuaian fisik yang ditemukan..."
                                                className="min-h-[80px] bg-white/50 border-destructive/20 focus-visible:ring-destructive"
                                                value={
                                                  officerFindings[
                                                    item.response_id
                                                  ]?.note ?? ''
                                                }
                                                onChange={(e) =>
                                                  handleUpdateNote(
                                                    item.response_id,
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                            </div>
                                            
                                            <div className="shrink-0 flex flex-col items-center gap-2">
                                              <div 
                                                className={`h-20 w-20 rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                                                  officerFindings[item.response_id]?.imagePath 
                                                    ? 'border-emerald-500 bg-emerald-50' 
                                                    : 'border-muted-foreground/30 hover:border-destructive hover:bg-destructive/5'
                                                }`}
                                                onClick={() => document.getElementById(`file-upload-${item.response_id}`)?.click()}
                                              >
                                                {officerFindings[item.response_id]?.imagePath ? (
                                                  <div className="relative w-full h-full group">
                                                    <img 
                                                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${officerFindings[item.response_id]?.imagePath}`}
                                                      className="w-full h-full object-cover"
                                                      alt="Finding proof"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                      <Camera className="h-5 w-5 text-white" />
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
                                                    <span className="text-[10px] text-muted-foreground font-medium">Foto Bukti</span>
                                                  </>
                                                )}
                                              </div>
                                              <input 
                                                type="file"
                                                id={`file-upload-${item.response_id}`}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) handleUploadImage(item.response_id, file);
                                                }}
                                              />
                                              {officerFindings[item.response_id]?.imagePath && (
                                                <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                                  onClick={() => {
                                                    setOfficerFindings(prev => {
                                                      const current = prev[item.response_id];
                                                      if (!current) return prev;
                                                      return {
                                                        ...prev,
                                                        [item.response_id]: { ...current, imagePath: undefined }
                                                      };
                                                    });
                                                  }}
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    </Fragment>
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

                {!readonly && <Separator />}

                {/* Keputusan */}
                {!readonly && (
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
                            <div className="rounded-full bg-status-success-bg p-1 text-status-success-fg">
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
                            <div className="rounded-full bg-status-error-bg p-1 text-status-error-fg">
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
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Gagal memuat data verifikasi.
            </div>
          )}
        </div>

        <SheetFooter className="mt-auto">
          {!readonly && (
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
          )}
          <SheetClose asChild>
            <Button variant={readonly ? 'default' : 'outline'}>
              {readonly ? 'Tutup' : 'Batal'}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
