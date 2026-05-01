import { ShieldAlert } from 'lucide-react';

interface OfficerDiscrepancyCardProps {
  note?: string;
  officerName?: string;
  imagePath?: string;
  apiUrl?: string;
  className?: string;
}

export function OfficerDiscrepancyCard({
  note,
  officerName,
  imagePath,
  apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  className = '',
}: OfficerDiscrepancyCardProps) {
  return (
    <div className={`mx-4 mb-4 mt-0 p-3 rounded-md bg-rose-50 border border-rose-100 flex gap-4 items-start shadow-sm ${className}`}>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-1.5 text-rose-700">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Catatan Petugas</span>
        </div>
        <p className="text-xs text-rose-900 font-medium leading-relaxed italic">
          &quot;{note || 'Tidak ada catatan spesifik.'}&quot;
        </p>
        <p className="text-[9px] text-muted-foreground pt-1">
          Oleh: {officerName || 'Petugas'}
        </p>
      </div>

      {imagePath && (
        <div 
          className="h-16 w-16 rounded border bg-white flex items-center justify-center overflow-hidden cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all"
          onClick={() => window.open(`${apiUrl}/${imagePath}`, '_blank')}
        >
          <img 
            src={`${apiUrl}/${imagePath}`}
            alt="Evidence"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
