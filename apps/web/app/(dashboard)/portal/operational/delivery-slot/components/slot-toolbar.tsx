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
import { Filter, X, Search } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface SlotToolbarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  status: string;
  setStatus: (status: string) => void;
  onReset: () => void;
}

export function SlotToolbar({
  searchTerm,
  onSearchChange,
  date,
  setDate,
  status,
  setStatus,
  onReset,
}: SlotToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2 min-w-[300px]">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari vendor..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <DatePickerWithRange 
          date={date} 
          setDate={setDate} 
          className="h-9" 
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 justify-start"
            >
              <Filter className="mr-2 h-4 w-4" />
              {status !== 'all' ? status : 'Status'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
              <DropdownMenuRadioItem value="all">
                Semua Status
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Open">Open</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Filled">
                Filled
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Check-In">
                Check-In
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Delay">Delay</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Missed">
                Missed
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {(searchTerm || status !== 'all' || date) && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
