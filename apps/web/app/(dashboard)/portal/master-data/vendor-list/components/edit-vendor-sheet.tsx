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
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUpdateVendor } from '@/hooks/api/use-vendors';
import { findVendorResponse } from '@repo/types';
import {
  Loader2,
  Building2,
  Barcode,
  Clock,
  Database,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

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

  const handleSave = () => {
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
      <SheetContent className="sm:max-w-xl w-full flex flex-col h-full ring-offset-0 focus-visible:outline-none [&>button]:hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Edit Vendor</SheetTitle>
            <Badge variant="outline" className="text-base px-3 py-1 font-mono">
              {vendor.vendor_code}
            </Badge>
          </div>
          <SheetDescription>
            Ubah informasi dasar vendor dan status keaktifan.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Informasi Readonly */}
            <div>
              <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                Informasi Sistem
              </h4>
              <div className="space-y-4">
                <Card className="p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                      <Barcode className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Kode Vendor
                      </p>
                      <p className="font-semibold text-base font-mono">
                        {vendor.vendor_code}
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">
                          Terakhir Update
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {vendor.updated_at
                          ? format(
                              new Date(vendor.updated_at),
                              'dd MMM yyyy, HH:mm',
                              {
                                locale: localeId,
                              },
                            )
                          : '-'}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">
                          Sumber Data
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        {'EXTERNAL_API'}{' '}
                        {/* Assuming hardcoded for now or field implies it */}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Form Edit */}
            <div>
              <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                Edit Data
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nama Perusahaan</Label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <Input
                      id="company_name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Masukkan nama perusahaan"
                      required
                      className="flex-1"
                    />
                  </div>
                </div>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_active" className="text-base">
                        Status Aktif
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Vendor aktif dapat dipilih saat check-in
                      </p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-auto p-6 border-t bg-background">
          <SheetClose asChild>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
          </SheetClose>
          <Button
            onClick={handleSave}
            disabled={updateVendor.isPending}
            className="min-w-[100px]"
          >
            {updateVendor.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Simpan
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
