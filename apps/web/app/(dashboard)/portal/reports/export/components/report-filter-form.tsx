'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInfiniteMaterialCategories } from '@/hooks/api/use-material-categories';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

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
  const { data: materialCategoriesData } = useInfiniteMaterialCategories({});

  const materialOptions = React.useMemo(() => {
    if (!materialCategoriesData) return [];
    return materialCategoriesData.pages.flatMap((page) =>
      page.data.map((item) => ({
        label: item.category_name,
        value: item.material_category_id.toString(),
      })),
    );
  }, [materialCategoriesData]);

  const hasFilters = !!date || status !== '' || !!materialCategoryId;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <DatePickerWithRange
            date={date}
            setDate={setDate}
            className="w-auto"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[160px] justify-start text-left font-normal"
              >
                <Filter className="mr-2 h-4 w-4" />
                {status
                  ? status === 'MENUNGGU'
                    ? 'Menunggu'
                    : status === 'VERIFIKASI'
                      ? 'Verifikasi'
                      : status === 'SELESAI'
                        ? 'Selesai'
                        : status === 'DITOLAK'
                          ? 'Ditolak'
                          : 'Status'
                  : 'Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={(val) => setStatus(val === 'ALL' ? '' : val)}
              >
                <DropdownMenuRadioItem value="">
                  Semua Status
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="MENUNGGU">
                  Menunggu
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="VERIFIKASI">
                  Verifikasi
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="SELESAI">
                  Selesai
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="DITOLAK">
                  Ditolak
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                <Filter className="mr-2 h-4 w-4" />
                {materialCategoryId
                  ? materialOptions.find(
                      (opt) => opt.value === materialCategoryId,
                    )?.label || 'Kategori'
                  : 'Kategori'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Kategori</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={materialCategoryId || ''}
                onValueChange={(val) => setMaterialCategoryId(val || undefined)}
              >
                <DropdownMenuRadioItem value="">
                  Semua Kategori
                </DropdownMenuRadioItem>
                {materialOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasFilters && (
            <Button
              variant="ghost"
              onClick={onReset}
              className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
