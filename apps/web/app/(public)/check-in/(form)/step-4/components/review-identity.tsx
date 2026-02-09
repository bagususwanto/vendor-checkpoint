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
                {step1Data.materialCategory.label}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
