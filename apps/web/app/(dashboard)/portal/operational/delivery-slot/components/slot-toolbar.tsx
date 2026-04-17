import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';

interface SlotToolbarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari vendor..."
            className="pl-8"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Check-In">Check-In</SelectItem>
            <SelectItem value="Delay">Delay</SelectItem>
            <SelectItem value="Missed">Missed</SelectItem>
          </SelectContent>
        </Select>
        <div className="w-[240px]">
           <DatePicker date={date} setDate={setDate} />
        </div>
        {(searchTerm || status !== 'all' || date) && (
          <Button variant="ghost" onClick={onReset} className="px-2">
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
