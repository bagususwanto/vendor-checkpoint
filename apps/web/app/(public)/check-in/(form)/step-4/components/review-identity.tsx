import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  User,
  Tag,
  ScanBarcode,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

import { Step1Data, PPEScanData } from '@/stores/use-checklist.store';
import { Badge } from '@/components/ui/badge';

interface ReviewIdentityProps {
  step1Data: Step1Data | null;
  ppeData: PPEScanData | null;
  isApdEnabled: boolean;
}

export function ReviewIdentity({ 
  step1Data, 
  ppeData, 
  isApdEnabled 
}: ReviewIdentityProps) {
  if (!step1Data) return null;

  return (
    <Card className="bg">
      <CardHeader>
        <CardTitle className="text-lg">Identitas & Perusahaan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">
                Nama Lengkap
              </p>
              <p className="font-medium text-lg">{step1Data.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Perusahaan</p>
              <p className="font-medium text-lg">
                {step1Data.company.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Kategori</p>
              <p className="font-medium text-lg">
                {step1Data.vendorCategory.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScanBarcode className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Delivery Note (DN)</p>
              <p className="font-medium text-lg">
                {step1Data.dnNumber || '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScanBarcode className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Purchase Order (PO)</p>
              <p className="font-medium text-lg">
                {step1Data.poNumber || '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Status Kedatangan</p>
              <div className="flex flex-col">
                <span className={`font-semibold ${
                  step1Data.arrivalStatus === 'Late' 
                    ? 'text-red-600' 
                    : step1Data.arrivalStatus === 'Unscheduled'
                      ? 'text-blue-600'
                      : 'text-green-600'
                }`}>
                  {step1Data.arrivalStatus === 'Late' 
                    ? 'Terlambat' 
                    : step1Data.arrivalStatus === 'Unscheduled'
                      ? 'Tanpa Jadwal'
                      : 'Tepat Waktu'}
                </span>
                {step1Data.arrivalStatus === 'Late' && step1Data.delayArrivalReasonLabel && (
                  <p className="text-sm text-muted-foreground italic">
                    Alasan: {step1Data.delayArrivalReasonLabel}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isApdEnabled && ppeData && (
            <div className="flex items-center gap-3 pt-2 border-t mt-3">
              {ppeData.isCompliant ? (
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-muted-foreground" />
              )}
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pemeriksaan APD</p>
                  <p className={`font-medium text-lg ${ppeData.isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                    {ppeData.isCompliant ? 'Lengkap' : 'Tidak Lengkap'}
                  </p>
                  {!ppeData.isCompliant && (
                    <p className="text-sm text-red-500 italic">
                      Tanpa: {[
                        !ppeData.hasHardhat && 'Helm',
                        !ppeData.hasSafetyVest && 'Rompi'
                      ].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <Badge variant={ppeData.isCompliant ? 'default' : 'destructive'} className="h-6">
                  {ppeData.isCompliant ? 'PASS' : 'FAIL'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
