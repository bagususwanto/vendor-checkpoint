'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUpdateVendor } from '@/hooks/api/use-vendors';
import { findVendorResponse } from '@repo/types';
import { Loader2 } from 'lucide-react';

interface EditVendorSheetProps {
  vendor: findVendorResponse;
  trigger: React.ReactNode;
}

export function EditVendorSheet({ vendor, trigger }: EditVendorSheetProps) {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState(vendor.company_name);
  const [isActive, setIsActive] = useState(vendor.is_active);

  const updateVendor = useUpdateVendor();

  // Reset form when vendor changes or sheet opens
  useEffect(() => {
    if (open) {
      setCompanyName(vendor.company_name);
      setIsActive(vendor.is_active);
    }
  }, [open, vendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateVendor.mutate(
      {
        id: vendor.vendor_id,
        data: {
          company_name: companyName,
          is_active: isActive,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Vendor</SheetTitle>
          <SheetDescription>
            Ubah informasi vendor. Klik simpan untuk menyimpan perubahan.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Vendor Code - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="vendor_code">Kode Vendor</Label>
            <Input
              id="vendor_code"
              value={vendor.vendor_code}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name">Nama Perusahaan</Label>
            <Input
              id="company_name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Masukkan nama perusahaan"
              required
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Status Aktif</Label>
              <p className="text-sm text-muted-foreground">
                Vendor nonaktif tidak akan muncul di dropdown check-in
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={updateVendor.isPending}>
              {updateVendor.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Simpan
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
