import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DeliverySlotResponse } from '@/services/delivery-slot.service';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface SlotTableProps {
  data: DeliverySlotResponse[];
  isLoading: boolean;
}

export function SlotTable({ data, isLoading }: SlotTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Belum ada data jadwal pengiriman ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="w-[150px]">Tanggal</TableHead>
              <TableHead className="w-[130px]">Waktu Tiba</TableHead>
              <TableHead className="w-[130px] text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((slot, idx) => (
              <TableRow key={slot.slot_id}>
                <TableCell className="text-center font-medium text-muted-foreground">
                  {idx + 1}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{slot.schedule?.vendor?.company_name || '-'}</span>
                    <span className="text-xs text-muted-foreground">{slot.schedule?.vendor?.vendor_code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {slot.expected_date ? format(new Date(slot.expected_date), 'dd MMM yyyy', { locale: id }) : '-'}
                </TableCell>
                <TableCell>
                  {slot.schedule?.expected_arrival ? slot.schedule.expected_arrival : 'Bebas / Penuh'}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={
                      slot.status === 'Open' ? 'outline' :
                      slot.status === 'Check-In' ? 'default' :
                      slot.status === 'Delay' ? 'secondary' : 'destructive'}
                  >
                    {slot.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

