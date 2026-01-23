'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MaterialCategoriesToolbarProps<TData> {
  table: Table<TData>;
  onAdd: () => void;
  onBulkDelete: (ids: number[]) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
}

export function MaterialCategoriesToolbar<TData>({
  table,
  onAdd,
  onBulkDelete,
  statusFilter,
  onStatusFilterChange,
  globalFilter,
  onGlobalFilterChange,
}: MaterialCategoriesToolbarProps<TData>) {
  const isFiltered = globalFilter !== '' || statusFilter !== 'all';
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari kategori..."
          value={globalFilter ?? ''}
          onChange={(event) => onGlobalFilterChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              onGlobalFilterChange('');
              onStatusFilterChange('all');
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {selectedRows.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const ids = selectedRows.map(
                (row) => (row.original as any).material_category_id,
              );
              onBulkDelete(ids);
            }}
          >
            Hapus ({selectedRows.length})
          </Button>
        )}
        <Button size="sm" onClick={onAdd}>
          Tambah Kategori
        </Button>
      </div>
    </div>
  );
}
