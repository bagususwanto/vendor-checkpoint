'use client';

import { ColumnDef, Table, Row, Column } from '@tanstack/react-table';
import { MaterialCategoryResponse } from '@repo/types';
import { Checkbox } from '../../../../../components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from 'lucide-react';

export const columns = (
  onEdit: (category: MaterialCategoryResponse) => void,
  onDelete: (category: MaterialCategoryResponse) => void,
): ColumnDef<MaterialCategoryResponse>[] => [
  {
    id: 'select',
    header: ({ table }: { table: Table<MaterialCategoryResponse> }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }: { row: Row<MaterialCategoryResponse> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'category_code',
    header: ({ column }: { column: Column<MaterialCategoryResponse> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Kode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'category_name',
    header: ({ column }: { column: Column<MaterialCategoryResponse> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama Kategori
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }: { row: Row<MaterialCategoryResponse> }) => {
      return (
        <div
          className="max-w-[300px] truncate"
          title={row.original.description || ''}
        >
          {row.original.description || '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }: { row: Row<MaterialCategoryResponse> }) => {
      const isActive = row.getValue('is_active');
      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={isActive ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {isActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }: { row: Row<MaterialCategoryResponse> }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(category)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4 text-destructive" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
