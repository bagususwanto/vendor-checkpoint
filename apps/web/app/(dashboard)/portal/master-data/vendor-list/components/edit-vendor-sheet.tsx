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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateVendor } from '@/hooks/api/use-vendors';
import { useMaterialCategories } from '@/hooks/api/use-material-categories';
import { findVendorResponse } from '@repo/types';
import {
  Loader2,
  Building2,
  Barcode,
  Clock,
  Database,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface EditVendorSheetProps {
  vendor: findVendorResponse;
  trigger: React.ReactNode;
}

export function EditVendorSheet({ vendor, trigger }: EditVendorSheetProps) {
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(vendor.is_active);
  const [categoryId, setCategoryId] = useState<string>(
    vendor.vendor_category_id?.toString() || '',
  );

  const updateVendor = useUpdateVendor();
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useMaterialCategories({
      is_active: true,
      search: '',
    });

  const categories = categoriesData?.pages.flatMap((page) => page.data) || [];

  // Reset form when vendor changes or sheet opens
  useEffect(() => {
    if (open) {
      setIsActive(vendor.is_active);
      setCategoryId(vendor.vendor_category_id?.toString() || '');
    }
  }, [open, vendor]);

  const handleSave = () => {
    updateVendor.mutate(
      {
        id: vendor.vendor_id,
        data: {
          is_active: isActive,
          vendor_category_id: categoryId ? parseInt(categoryId) : undefined,
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
            <div className="space-y-6">
              {/* Nama Perusahaan (Card Style like VerificationSheet) */}
              <div>
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                  Info Vendor
                </h4>
                <div className="space-y-4">
                  <Card className="p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Nama Perusahaan
                        </p>
                        <p className="font-semibold text-base">
                          {vendor.company_name}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Edit Section */}
              <div>
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                  Edit Data
                </h4>
                <div className="space-y-4">
                  {/* Vendor Category */}
                  <Card className="p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-orange-100 p-2 text-orange-600 shrink-0">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor="category"
                          className="text-sm font-medium"
                        >
                          Kategori Vendor
                        </Label>
                        <Select
                          value={categoryId}
                          onValueChange={setCategoryId}
                        >
                          <SelectTrigger
                            id="category"
                            className="bg-background h-9 border-muted-foreground/30 focus:ring-0 focus:border-primary"
                          >
                            <SelectValue placeholder="Pilih kategori vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingCategories ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                Memuat kategori...
                              </div>
                            ) : categories.length === 0 ? (
                              <div className="p-2 text-center text-sm text-muted-foreground">
                                Tidak ada kategori tersedia
                              </div>
                            ) : (
                              categories.map((cat) => (
                                <SelectItem
                                  key={cat.material_category_id}
                                  value={cat.material_category_id.toString()}
                                >
                                  {cat.category_name} ({cat.category_code})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  {/* Active Status */}
                  <Card className="p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_active" className="text-base">
                          Status Aktif
                        </Label>
                        <p className="text-xs text-muted-foreground">
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

              <Separator />

              {/* Info Sistem (Bottom) */}
              <div>
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground uppercase tracking-wider">
                  Informasi Sistem
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                        <Barcode className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Kode
                        </p>
                        <p className="font-mono text-sm font-semibold">
                          {vendor.vendor_code}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-500">
                        <Database className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Sumber
                        </p>
                        <p className="font-semibold text-sm">External API</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 shadow-sm col-span-2">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-green-50 p-2 text-green-600">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Terakhir Sync
                        </p>
                        <p className="font-semibold text-sm">
                          {vendor.updated_at
                            ? format(
                                new Date(vendor.updated_at),
                                'dd MMMM yyyy, HH:mm',
                                {
                                  locale: localeId,
                                },
                              )
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
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
