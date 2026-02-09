import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ProcessingCheckIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full animate-in fade-in duration-500">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="relative bg-background p-4 rounded-full border shadow-sm">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              Memproses Data
            </h3>
            <p className="text-muted-foreground">
              Mohon tunggu sebentar, kami sedang memproses check-in Anda...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
