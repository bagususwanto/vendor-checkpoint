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
import { DropdownMaterialCategory } from '@/components/dropdown-material-category';
import { useMaterialCategories } from '@/hooks/api/use-material-categories';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';

interface ReportFilterFormProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  status: string;
  setStatus: (status: string) => void;
  materialCategoryId: string | undefined;
  setMaterialCategoryId: (id: string | undefined) => void;
}

export function ReportFilterForm({
  date,
  setDate,
  status,
  setStatus,
  materialCategoryId,
  setMaterialCategoryId,
}: ReportFilterFormProps) {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: materialCategoriesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useMaterialCategories({
    search: debouncedSearch,
  });

  const materialOptions = React.useMemo(() => {
    if (!materialCategoriesData) return [];
    return materialCategoriesData.pages.flatMap((page) =>
      page.data.map((item) => ({
        label: item.category_name,
        value: item.material_category_id.toString(),
        description: item.category_code,
      })),
    );
  }, [materialCategoriesData]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label>Periode Tanggal</Label>
        <DatePickerWithRange date={date} setDate={setDate} className="w-full" />
      </div>

      <div className="space-y-2">
        <Label>Status Check-in</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
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
        <Label>Kategori Material</Label>
        <DropdownMaterialCategory
          options={materialOptions}
          value={materialCategoryId}
          onSelect={(val) => setMaterialCategoryId(val)}
          onSearch={setSearch}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isLoading={isFetching}
        />
        {materialCategoryId && (
          <p
            className="text-xs text-muted-foreground cursor-pointer hover:underline"
            onClick={() => setMaterialCategoryId(undefined)}
          >
            Reset Kategori
          </p>
        )}
      </div>
    </div>
  );
}
