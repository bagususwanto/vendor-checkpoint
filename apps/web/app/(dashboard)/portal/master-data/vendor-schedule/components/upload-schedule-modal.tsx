'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useDownloadVendorScheduleTemplate,
  useUploadVendorSchedule,
} from '@/hooks/api/use-vendor-schedule';

interface UploadScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadScheduleModal({ open, onOpenChange }: UploadScheduleModalProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const { mutate: downloadTemplate, isPending: isDownloading } = useDownloadVendorScheduleTemplate();
  const { mutate: uploadExcel, isPending: isUploading } = useUploadVendorSchedule();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Silakan pilih file terlebih dahulu');
      return;
    }

    uploadExcel(file, {
      onSuccess: () => {
        toast.success('Jadwal vendor berhasil diperbarui');
        setFile(null);
        onOpenChange(false);
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Gagal mengunggah jadwal';
        toast.error(message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Jadwal Vendor</DialogTitle>
          <DialogDescription>
            Unggah file Excel untuk memperbarui jadwal vendor sekaligus. Gunakan template yang telah disediakan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium">Template Excel</p>
                <p className="text-xs text-muted-foreground">Unduh format yang didukung</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate()}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Unduh
            </Button>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="excel-file">Pilih File Excel (.xlsx)</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                File terpilih: <span className="font-medium text-foreground">{file.name}</span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Batal
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Mulai Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
