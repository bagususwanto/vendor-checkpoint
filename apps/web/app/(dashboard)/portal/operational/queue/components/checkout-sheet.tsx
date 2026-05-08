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
import {
  Building2,
  Package,
  User,
  Clock,
  LogOut,
  AlertTriangle,
  Loader2,
  icons,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Maximize2,
} from 'lucide-react';
import { useState } from 'react';
import {
  useCheckoutCheckIn,
  useVerificationDetail,
  useDepartureCheck,
} from '@/hooks/api/use-check-in';
import { useDelayReasons } from '@/hooks/api/use-delay-reasons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { formatDateTime, cn } from '@/lib/utils';
import { StatusBadge } from '@/app/(dashboard)/components/status-badge';
import { OfficerDiscrepancyCard } from '@/components/officer-discrepancy-card';

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
  const departureCheckMutation = useDepartureCheck();
  const [detectedStatus, setDetectedStatus] = useState<'On-Time' | 'Late' | 'Unscheduled' | null>(null);
  const [delayReasonId, setDelayReasonId] = useState<string>('');

  const { data: delayReasons } = useDelayReasons({
    category: 'Departure',
    isActive: true,
  });

  // Fetch detail data
  const { data: detailData, isLoading } = useVerificationDetail(
    open ? checkin.id : '',
  );

  useEffect(() => {
    if (open && checkin.id) {
      departureCheckMutation.mutate(checkin.id, {
        onSuccess: (data) => {
          setDetectedStatus(data.departure_status);
        },
      });
    } else if (!open) {
      setDetectedStatus(null);
      setDelayReasonId('');
    }
  }, [open, checkin.id]);

  const handleCheckout = () => {
    if (detectedStatus === 'Late' && !delayReasonId) {
      toast.error('Reason Required', {
        description: 'Please select a departure delay reason.',
      });
      return;
    }

    checkoutMutation.mutate(
      { 
        queue_number: checkin.id,
        departure_status: detectedStatus || undefined,
        delay_departure_reason_id: delayReasonId ? parseInt(delayReasonId) : undefined
      },
      {
        onSuccess: () => {
          toast.success('Checkout Successful', {
            description: `Driver ${checkin.driver} has successfully checked out.`,
          });
          setOpen(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error('Checkout Failed', {
            description:
              error.message || 'An error occurred while processing checkout.',
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
            <SheetTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-orange-500" />
              Check-Out Confirmation
            </SheetTitle>
            <Badge variant="outline" className="text-base px-3 py-1">
              {checkin.id}
            </Badge>
          </div>
          <SheetDescription>
            Ensure all processes are completed before allowing the driver to exit.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : detailData ? (
            <div className="grid grid-cols-1 gap-6">
              {/* Summary Alerts */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-lg border border-orange-100 text-orange-800">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <p className="text-sm">
                    This action will complete this driver's visit session in the company area.
                  </p>
                </div>

                {detailData.ops_officer_discrepancy?.length > 0 && (
                  <Alert variant="destructive" className="border-2 border-rose-200 bg-rose-50/50">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <AlertTitle className="text-rose-800 font-bold">Officer Discrepancy Found</AlertTitle>
                    <AlertDescription className="text-rose-700 text-xs">
                      <p className="mb-2">There are {detailData.ops_officer_discrepancy.length} physical discrepancy findings that need to be reviewed on:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {detailData.checklist_responses?.map((cat: any) => {
                          const count = cat.items.filter((item: any) => item.officer_discrepancy).length;
                          if (count === 0) return null;
                          return (
                            <Badge 
                              key={cat.category_name}
                              className="text-[10px] px-2 py-0 h-5 border-none shadow-sm" 
                              style={{ backgroundColor: cat.color_code || '#e11d48', color: 'white' }}
                            >
                              {cat.category_name}: {count}
                            </Badge>
                          );
                        })}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Identitas Section */}
              <div>
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                  Shipper Identity
                </h4>
                <div className="space-y-4">
                  <Card className="p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Company
                        </p>
                        <p className="font-semibold text-base leading-tight">
                          {detailData.snapshot_company_name}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground bg-muted/50 w-fit px-1 rounded">
                          {detailData.mst_vendor?.vendor_code || '-'}
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
                          Vendor Category
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
                      <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          DN / PO Number
                        </p>
                        <p className="font-semibold text-base">
                          {detailData.dn_number || '-'} /{' '}
                          {detailData.po_number || '-'}
                        </p>
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
                                    : detailData.arrival_status === 'Unscheduled'
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
                          {detailData.arrival_status === 'Late' && detailData.delay_arrival_reason?.reason_text && (
                            <p className="text-[10px] text-destructive mt-1.5 font-semibold leading-tight italic">
                              "{detailData.delay_arrival_reason.reason_text}"
                            </p>
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
                    
                    {detailData.ops_ppe_scan && (
                      <Card className={`overflow-hidden border-2 transition-all col-span-2 ${detailData.ops_ppe_scan.is_compliant 
                        ? 'border-emerald-100 bg-emerald-50/30' 
                        : 'border-rose-100 bg-rose-50/30'}`}>
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
                                  {detailData.ops_ppe_scan.is_compliant ? 'Pass' : 'Fail'}
                                </Badge>
                                <span className={`text-sm font-semibold ${
                                  detailData.ops_ppe_scan.is_compliant ? 'text-emerald-700' : 'text-rose-700'
                                }`}>
                                  {detailData.ops_ppe_scan.is_compliant 
                                    ? 'APD Lengkap' 
                                    : 'Atribut Tidak Lengkap'}
                                </span>
                              </div>

                              {!detailData.ops_ppe_scan.is_compliant && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {[
                                    { key: 'has_hardhat', label: 'Helm Safety' },
                                    { key: 'has_safety_vest', label: 'Rompi Safety' }
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
                                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/${detailData.ops_ppe_scan.image_path}`, '_blank')}
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
                                Evidence Photo
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Keberangkatan Section */}
              <div>
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                  Departure Status
                </h4>
                <Card className={cn(
                  "border-2 transition-all overflow-hidden",
                  departureCheckMutation.isPending ? "bg-muted/30 animate-pulse border-muted" : 
                  detectedStatus === 'On-Time' ? "border-emerald-100 bg-emerald-50/30" : 
                  detectedStatus === 'Late' ? "border-rose-100 bg-rose-50/30" : "border-muted bg-muted/10"
                )}>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-full",
                          departureCheckMutation.isPending ? "bg-muted text-muted-foreground" :
                          detectedStatus === 'On-Time' ? "bg-emerald-100 text-emerald-600" : 
                          detectedStatus === 'Late' ? "bg-rose-100 text-rose-600" : "bg-muted text-muted-foreground"
                        )}>
                          {detectedStatus === 'Late' ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Departure Status</p>
                          <p className={cn("text-lg font-bold leading-tight", 
                            detectedStatus === 'On-Time' ? "text-emerald-700" : 
                            detectedStatus === 'Late' ? "text-rose-700" : "text-muted-foreground"
                          )}>
                            {departureCheckMutation.isPending ? 'Checking...' : (detectedStatus || '-')}
                          </p>
                        </div>
                      </div>
                      {departureCheckMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      ) : detectedStatus ? (
                        <Badge
                          variant={
                            detectedStatus === 'On-Time'
                              ? 'default'
                              : detectedStatus === 'Unscheduled'
                                ? 'outline'
                                : 'destructive'
                          }
                        >
                          {detectedStatus}
                        </Badge>
                      ) : null}
                    </div>

                    {detectedStatus === 'Late' && (
                      <div className="mt-4 pt-4 border-t border-rose-200/50 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="delayReason" className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                            Select Delay Reason <span className="text-rose-500">*</span>
                          </Label>
                          <Select
                            value={delayReasonId}
                            onValueChange={setDelayReasonId}
                          >
                            <SelectTrigger id="delayReason" className="w-full bg-white/50 border-rose-200 focus:ring-rose-500">
                              <SelectValue placeholder="--- Select Reason ---" />
                            </SelectTrigger>
                            <SelectContent>
                              {delayReasons?.data?.map((reason: any) => (
                                <SelectItem
                                  key={reason.delay_reason_id}
                                  value={reason.delay_reason_id.toString()}
                                >
                                  {reason.reason_text}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {detailData.arrival_status === 'Late' && (
                          <div className="text-[10px] text-amber-700 font-medium bg-amber-100/50 p-2.5 rounded-md border border-amber-200/50 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                            <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                            <p>
                              <span className="font-bold">Suggestion:</span> This vendor is recorded as arriving late, you can select the reason <span className="underline italic">"Accumulated Arrival Delay"</span>.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Log Waktu Section */}
              <div>
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                  Time Logs
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Waktu Submit
                      </p>
                      <p className="font-semibold text-sm">
                        {detailData.submission_time
                          ? formatDateTime(
                              detailData.submission_time,
                              'dd MMM yyyy, HH:mm',
                            )
                          : '-'}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Check-in Time
                      </p>
                      <p className="font-semibold text-sm">
                        {detailData.ops_timelog?.checkin_time
                          ? formatDateTime(
                              detailData.ops_timelog.checkin_time,
                              'dd MMM yyyy, HH:mm',
                            )
                          : '-'}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Informasi Verifikasi Section */}
              {detailData.ops_verification && (
                <div>
                  <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                    Informasi Verifikasi
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Verification Status
                        </p>
                        <StatusBadge
                          status={
                            detailData.ops_verification.verification_status
                          }
                        />
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm text-right">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Verified By
                        </p>
                        <p className="font-semibold text-sm">
                          {detailData.ops_verification.user?.full_name || '-'}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 shadow-sm col-span-2">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Verification Time
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
                  </div>
                </div>
              )}

              {/* Checklist Section */}
              <div>
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                  Inspection Results
                </h4>

                {nonCompliantCount > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Attention</AlertTitle>
                    <AlertDescription>
                      {nonCompliantCount} items did not meet standards during check-in.
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
                            index === detailData.checklist_responses.length - 1
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
                              {category.items.map((item: any, idx: number) => (
                                <div 
                                  key={idx}
                                  className="flex flex-col border-b last:border-b-0"
                                >
                                  <div
                                    className="flex items-start justify-between gap-4 p-4 hover:bg-muted/30 transition-colors"
                                  >
                                    <div className="space-y-1">
                                      <p
                                        className={`text-sm ${
                                          !item.is_compliant || item.officer_discrepancy
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
                                        {item.officer_discrepancy && (
                                          <Badge
                                            variant="destructive"
                                            className="text-[10px] px-1.5 py-0 h-5 font-bold uppercase animate-pulse"
                                          >
                                            Temuan Petugas
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="shrink-0">
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
                                        {item.response_value ? 'Ya' : 'Tidak'}
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Officer Discrepancy Detail */}
                                  {item.officer_discrepancy && (
                                    <OfficerDiscrepancyCard 
                                      note={item.officer_discrepancy.officer_note}
                                      officerName={item.officer_discrepancy.officer_name}
                                      imagePath={item.officer_discrepancy.evidence_image_path}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    },
                  )}
                </Accordion>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Failed to load detail data.
            </div>
          )}
        </div>

        <SheetFooter className="mt-auto pt-4 border-t gap-2 sm:gap-0">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending || !detailData}
          >
            {checkoutMutation.isPending ? 'Processing...' : 'Process Check-Out'}
          </Button>
          <SheetClose asChild>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
