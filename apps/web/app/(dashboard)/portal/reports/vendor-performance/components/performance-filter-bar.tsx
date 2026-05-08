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
import { useInfiniteVendorCategories } from '@/hooks/api/use-vendor-categories';
import { Button } from '@/components/ui/button';
import { Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PerformanceFilterBarProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  granularity: 'daily' | 'monthly' | 'yearly';
  setGranularity: (val: 'daily' | 'monthly' | 'yearly') => void;
  vendorCategoryId: string | undefined;
  setVendorCategoryId: (id: string | undefined) => void;
  onReset: () => void;
}

export function PerformanceFilterBar({
  date,
  setDate,
  granularity,
  setGranularity,
  vendorCategoryId,
  setVendorCategoryId,
  onReset,
}: PerformanceFilterBarProps) {
  const { data: vendorCategoriesData } = useInfiniteVendorCategories({});

  const vendorCategoryOptions = React.useMemo(() => {
    if (!vendorCategoriesData) return [];
    return vendorCategoriesData.pages.flatMap((page) =>
      page.data.map((item) => ({
        label: item.category_name,
        value: item.vendor_category_id.toString(),
      })),
    );
  }, [vendorCategoriesData]);

  const hasFilters = !!date || granularity !== 'daily' || !!vendorCategoryId;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase text-muted-foreground ml-1">Period</span>
            <DatePickerWithRange
              date={date}
              setDate={setDate}
              className="w-auto"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase text-muted-foreground ml-1">Granularity</span>
            <Tabs 
              value={granularity} 
              onValueChange={(val) => setGranularity(val as any)}
              className="h-9"
            >
              <TabsList className="h-9">
                <TabsTrigger value="daily" className="text-xs h-7 px-3">Daily</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs h-7 px-3">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="text-xs h-7 px-3">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase text-muted-foreground ml-1">Filter Category</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 w-[180px] justify-start text-left font-normal text-xs"
                >
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  {vendorCategoryId
                    ? vendorCategoryOptions.find(
                        (opt) => opt.value === vendorCategoryId,
                      )?.label || 'All Categories'
                    : 'All Categories'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel className="text-xs">Filter Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={vendorCategoryId || ''}
                  onValueChange={(val) => setVendorCategoryId(val || undefined)}
                >
                  <DropdownMenuRadioItem value="" className="text-xs">
                    All Categories
                  </DropdownMenuRadioItem>
                  {vendorCategoryOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className="text-xs"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {hasFilters && (
            <div className="flex flex-col gap-1.5 justify-end">
              <div className="h-[15px]" />
              <Button
                variant="ghost"
                onClick={onReset}
                className="h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground text-xs"
              >
                Reset
                <X className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
