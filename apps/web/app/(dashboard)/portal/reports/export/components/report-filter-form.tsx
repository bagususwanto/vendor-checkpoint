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
import { Filter, X } from 'lucide-react';
import { QueueStatus } from '@repo/types';

interface ReportFilterFormProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  status: string;
  setStatus: (status: string) => void;
  arrivalStatus: string;
  setArrivalStatus: (status: string) => void;
  departureStatus: string;
  setDepartureStatus: (status: string) => void;
  vendorCategoryId: string | undefined;
  setVendorCategoryId: (id: string | undefined) => void;
  onReset: () => void;
}

export function ReportFilterForm({
  date,
  setDate,
  status,
  setStatus,
  arrivalStatus,
  setArrivalStatus,
  departureStatus,
  setDepartureStatus,
  vendorCategoryId,
  setVendorCategoryId,
  onReset,
}: ReportFilterFormProps) {
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

  const hasFilters =
    !!date ||
    status !== '' ||
    arrivalStatus !== '' ||
    departureStatus !== '' ||
    !!vendorCategoryId;

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
                  ? status === QueueStatus.WAITING
                    ? 'Waiting'
                    : status === QueueStatus.APPROVED
                      ? 'Approved'
                      : status === QueueStatus.ACTIVE
                        ? 'Active'
                        : status === QueueStatus.COMPLETED
                          ? 'Completed'
                          : status === QueueStatus.REJECTED
                            ? 'Rejected'
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
                  All Statuses
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={QueueStatus.WAITING}>
                  Waiting
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={QueueStatus.APPROVED}>
                  Approved
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={QueueStatus.ACTIVE}>
                  Active
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={QueueStatus.COMPLETED}>
                  Completed
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={QueueStatus.REJECTED}>
                  Rejected
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[170px] justify-start text-left font-normal"
              >
                <Filter className="mr-2 h-4 w-4" />
                {arrivalStatus
                  ? arrivalStatus === 'On-Time'
                    ? 'Arrival: On-Time'
                    : arrivalStatus === 'Late'
                      ? 'Arrival: Late'
                      : arrivalStatus === 'Early'
                        ? 'Arrival: Early'
                        : arrivalStatus === 'Unscheduled'
                          ? 'Arrival: Unscheduled'
                          : 'Arrival Status'
                  : 'Arrival Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Arrival Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={arrivalStatus}
                onValueChange={(val) => setArrivalStatus(val)}
              >
                <DropdownMenuRadioItem value="">
                  All Arrival Statuses
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="On-Time">
                  On-Time
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Late">
                  Late
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Early">
                  Early
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Unscheduled">
                  Unscheduled
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
                {departureStatus
                  ? departureStatus === 'On-Time'
                    ? 'Departure: On-Time'
                    : departureStatus === 'Overdue'
                      ? 'Departure: Overdue'
                      : 'Departure Status'
                  : 'Departure Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Departure Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={departureStatus}
                onValueChange={(val) => setDepartureStatus(val)}
              >
                <DropdownMenuRadioItem value="">
                  All Departure Statuses
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="On-Time">
                  On-Time
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Overdue">
                  Overdue
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
                {vendorCategoryId
                  ? vendorCategoryOptions.find(
                      (opt) => opt.value === vendorCategoryId,
                    )?.label || 'Kategori'
                  : 'Kategori'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Kategori</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={vendorCategoryId || ''}
                onValueChange={(val) => setVendorCategoryId(val || undefined)}
              >
                <DropdownMenuRadioItem value="">
                  All Categories
                </DropdownMenuRadioItem>
                {vendorCategoryOptions.map((option) => (
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
