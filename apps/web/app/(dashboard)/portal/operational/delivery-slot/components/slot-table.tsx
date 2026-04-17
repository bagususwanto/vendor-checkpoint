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

interface SlotTableProps {
  data: DeliverySlotResponse[];
  isLoading: boolean;
}

export function SlotTable({ data, isLoading }: SlotTableProps) {
  if (isLoading) {
    return <div className="p-4 text-center">Loading Data...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Tidak ada jadwal pengiriman vendor.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Vendor</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Waktu Kedatangan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((slot, idx) => (
            <TableRow key={slot.slot_id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="font-medium">
                {slot.schedule?.vendor?.company_name || 'N/A'}
              </TableCell>
              <TableCell>
                {slot.expected_date ? format(new Date(slot.expected_date), 'dd MMMM yyyy', { locale: id }) : '-'}
              </TableCell>
              <TableCell>
                {slot.schedule?.expected_arrival ? slot.schedule.expected_arrival : 'Bebas / Penuh'}
              </TableCell>
              <TableCell>
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
  );
}
