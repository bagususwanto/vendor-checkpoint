'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { DayOfWeek, DAY_NAMES, DAY_OPTIONS } from '@repo/types';

interface ScheduleToolbarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dayOfWeek: string;
  setDayOfWeek: (day: string) => void;
  onReset: () => void;
}

export function ScheduleToolbar({
  searchTerm,
  onSearchChange,
  dayOfWeek,
  setDayOfWeek,
  onReset,
}: ScheduleToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2 min-w-[300px]">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama vendor..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 justify-start"
            >
              <Filter className="mr-2 h-4 w-4" />
              {dayOfWeek
                ? DAY_NAMES[Number(dayOfWeek)]
                : 'Hari'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter Hari</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={dayOfWeek} onValueChange={setDayOfWeek}>
              <DropdownMenuRadioItem value="">
                Semua Hari
              </DropdownMenuRadioItem>
              {DAY_OPTIONS.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={String(option.value)}
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {(searchTerm || dayOfWeek) && (
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
