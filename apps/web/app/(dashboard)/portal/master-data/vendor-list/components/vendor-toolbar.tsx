'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Search, X } from 'lucide-react';
import { useSyncVendors } from '@/hooks/api/use-vendors';

interface VendorToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  onReset: () => void;
}

export function VendorToolbar({
  search,
  setSearch,
  status,
  setStatus,
  onReset,
}: VendorToolbarProps) {
  const syncVendors = useSyncVendors();

  const hasFilters = search || status !== 'all';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau kode vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Sync Button */}
      <Button
        variant="outline"
        onClick={() => syncVendors.mutate()}
        disabled={syncVendors.isPending}
      >
        <RefreshCw
          className={`mr-2 h-4 w-4 ${syncVendors.isPending ? 'animate-spin' : ''}`}
        />
        {syncVendors.isPending ? 'Syncing...' : 'Sync Vendor'}
      </Button>
    </div>
  );
}
