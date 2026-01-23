'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Filter, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { QueueStatus } from '@repo/types';

interface QueueToolbarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  status: string;
  setStatus: (status: string) => void;
  categoryId: string;
  setCategoryId: (categoryId: string) => void;
  categories: any; // Type should be properly defined based on useMaterialCategories return
  onReset: () => void;
}

export function QueueToolbar({
  searchTerm,
  onSearchChange,
  date,
  setDate,
  status,
  setStatus,
  categoryId,
  setCategoryId,
  categories,
  onReset,
}: QueueToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2 min-w-[300px]">
        <Input
          placeholder="Cari driver, perusahaan..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <DatePickerWithRange date={date} setDate={setDate} className="w-auto" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-start"
            >
              <Filter className="mr-2 h-4 w-4" />
              {status
                ? status === QueueStatus.DISETUJUI
                  ? 'Disetujui'
                  : status === QueueStatus.DITOLAK
                    ? 'Ditolak'
                    : 'Menunggu'
                : 'Status'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
              <DropdownMenuRadioItem value="">
                Semua Status
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={QueueStatus.DISETUJUI}>
                Disetujui
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={QueueStatus.DITOLAK}>
                Ditolak
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={QueueStatus.MENUNGGU}>
                Menunggu
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-start"
            >
              <Filter className="mr-2 h-4 w-4" />
              {categoryId
                ? categories?.find(
                    (c: any) => String(c.material_category_id) === categoryId,
                  )?.category_name || 'Kategori'
                : 'Kategori'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter Kategori</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={categoryId}
              onValueChange={setCategoryId}
            >
              <DropdownMenuRadioItem value="">
                Semua Kategori
              </DropdownMenuRadioItem>
              {categories?.map((category: any) => (
                <DropdownMenuRadioItem
                  key={category.material_category_id}
                  value={String(category.material_category_id)}
                >
                  {category.category_name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {(searchTerm || date || status || categoryId) && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
