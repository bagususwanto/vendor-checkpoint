import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VendorInfoCardProps {
  categoryName: string;
  vendorCode: string;
}

export function VendorInfoCard({ categoryName, vendorCode }: VendorInfoCardProps) {
  return (
    <Card className="bg-muted/50 border-dashed">
      <CardHeader>
        <CardTitle className="text-lg">Informasi Lainnya</CardTitle>
      </CardHeader>
      <CardContent className="gap-4 grid grid-cols-2">
        <div className="gap-1 grid">
          <span className="font-medium text-muted-foreground text-sm">
            Kategori
          </span>
          <span className="font-semibold text-base">
            {categoryName}
          </span>
        </div>
        <div className="gap-1 grid">
          <span className="font-medium text-muted-foreground text-sm">
            Kode Perusahaan
          </span>
          <span className="font-semibold text-base">
            {vendorCode}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
