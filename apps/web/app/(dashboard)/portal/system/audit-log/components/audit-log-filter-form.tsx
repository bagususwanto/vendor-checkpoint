'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, X, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuditLogFilterFormProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  actionType: string;
  setActionType: (type: string) => void;
  onReset: () => void;
}

export function AuditLogFilterForm({
  date,
  setDate,
  actionType,
  setActionType,
  onReset,
}: AuditLogFilterFormProps) {
  const hasFilters = !!date || actionType !== '';

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <DatePickerWithRange
            date={date}
            setDate={setDate}
            className="w-auto"
          />

          <div className="flex items-center space-x-2">
            <Select
              value={actionType === '' ? 'ALL' : actionType}
              onValueChange={(val) => setActionType(val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Action</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="LOGOUT">Logout</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
                <SelectItem value="EXPORT">Export</SelectItem>
                <SelectItem value="VERIFY">Verify</SelectItem>
                <SelectItem value="REJECT">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
