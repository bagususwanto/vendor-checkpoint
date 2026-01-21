'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMaterialCategories } from '@/hooks/api/use-material-categories';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ReportFilterFormProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  status: string;
  setStatus: (status: string) => void;
  materialCategoryId: string | undefined;
  setMaterialCategoryId: (id: string | undefined) => void;
  onReset: () => void;
}

export function ReportFilterForm({
  date,
  setDate,
  status,
  setStatus,
  materialCategoryId,
  setMaterialCategoryId,
  onReset,
}: ReportFilterFormProps) {
  const { data: materialCategoriesData } = useMaterialCategories({});

  const materialOptions = React.useMemo(() => {
    if (!materialCategoriesData) return [];
    return materialCategoriesData.pages.flatMap((page) =>
      page.data.map((item) => ({
        label: item.category_name,
        value: item.material_category_id.toString(),
      })),
    );
  }, [materialCategoriesData]);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Periode Tanggal
          </Label>
          <DatePickerWithRange
            date={date}
            setDate={setDate}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status Check-in
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="MENUNGGU">Menunggu</SelectItem>
              <SelectItem value="VERIFIKASI">Verifikasi</SelectItem>
              <SelectItem value="SELESAI">Selesai</SelectItem>
              <SelectItem value="DITOLAK">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kategori Material
          </Label>
          <Select
            value={materialCategoryId || 'ALL'}
            onValueChange={(val) =>
              setMaterialCategoryId(val === 'ALL' ? undefined : val)
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Kategori</SelectItem>
              {materialOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onReset}
            className="h-10 px-6 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
