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
} from 'lucide-react';

import { Step1Data } from '@/stores/use-checklist.store';

interface ReviewIdentityProps {
  step1Data: Step1Data | null;
}

export function ReviewIdentity({ step1Data }: ReviewIdentityProps) {
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
          {step1Data.dnNumber && (
            <div className="flex items-center gap-3">
              <ScanBarcode className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-sm">Delivery Note (DN)</p>
                <p className="font-medium text-lg">
                  {step1Data.dnNumber}
                </p>
              </div>
            </div>
          )}
          {step1Data.poNumber && (
            <div className="flex items-center gap-3">
              <ScanBarcode className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-sm">Purchase Order (PO)</p>
                <p className="font-medium text-lg">
                  {step1Data.poNumber}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-sm">Status Kedatangan</p>
              <div className="flex flex-col">
                <span className={`font-semibold ${step1Data.arrivalStatus === 'Late' ? 'text-red-600' : 'text-green-600'}`}>
                  {step1Data.arrivalStatus === 'Late' ? 'Terlambat' : 'Tepat Waktu'}
                </span>
                {step1Data.arrivalStatus === 'Late' && step1Data.delayArrivalReasonLabel && (
                  <p className="text-sm text-muted-foreground italic">
                    Alasan: {step1Data.delayArrivalReasonLabel}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
