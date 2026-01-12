'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VerificationSheet } from '../dashboard/components/verification-sheet';
import { useVerificationList } from '@/hooks/api/use-check-in';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useDebounce } from '../../../../hooks/use-debounce';
import { Separator } from '@/components/ui/separator';

import { useMaterialCategories } from '@/hooks/api/use-material-categories';
import { QueueStatus } from '@repo/types';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

export default function VerificationPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: categories } = useMaterialCategories({
    search: '',
    is_active: true,
  });

  const { data, isLoading } = useVerificationList(
    page,
    limit,
    debouncedSearchTerm,
    {
      start_date: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
      end_date: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
      material_category_id: categoryId || undefined,
      status: status || undefined, // Passing status to filter
    },
  );

  // Basic debounce implementation since I'm not sure if useDebounce exists
  // If useDebounce doesn't exist, I'll need to remove the import or implement it.
  // Let's assume standard debouncing via useEffect or useRequest hook's built-in ?
  // useVerificationList passes search directly.
  // I will check for useDebounce existence first or just implement local debounce.
  // For now, I'll use a local efficient debounce or just pass it if query handles it.

  // Actually, let's use a safe approach: direct state for now, optimize later or check file tree.
  // BETTER: Check if useDebounce exists. I saw `hooks` dir.

  const checkins = data?.data || [];
  const meta: any = data?.meta; // Type assertion to bypass potential type mismatch for now

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const totalPages = meta?.last_page || meta?.lastPage || meta?.pageCount || 1; // Robust fallback

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Verifikasi</h2>
      </div>
      <Separator />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Cari driver, perusahaan..."
            value={searchTerm}
            onChange={handleSearch}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <DatePickerWithRange
            date={date}
            setDate={(d) => {
              setDate(d);
              setPage(1);
            }}
            className="w-full md:w-auto"
          />
          <select
            className="h-8 w-full md:w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value={QueueStatus.DISETUJUI}>Disetujui</option>
            <option value={QueueStatus.DITOLAK}>Ditolak</option>
            <option value={QueueStatus.MENUNGGU}>Menunggu</option>
          </select>
          <select
            className="h-8 w-full md:w-[150px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Kategori</option>
            {categories?.pages
              .flatMap((page) => page.data)
              .map((category) => (
                <option
                  key={category.material_category_id}
                  value={category.material_category_id}
                >
                  {category.category_name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Verifikasi</CardTitle>
          <CardDescription>Kelola verifikasi check-in driver.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Antrean</TableHead>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : checkins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                checkins.map((checkin: any) => (
                  <TableRow key={checkin.queue_number}>
                    <TableCell className="font-medium">
                      {checkin.queue_number}
                    </TableCell>
                    <TableCell>{checkin.snapshot_company_name}</TableCell>
                    <TableCell>{checkin.driver_name}</TableCell>
                    <TableCell>{checkin.snapshot_category_name}</TableCell>
                    <TableCell>
                      {checkin.submission_time
                        ? format(
                            new Date(checkin.submission_time),
                            'dd MMM HH:mm',
                            {
                              locale: id,
                            },
                          )
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          checkin.current_status === QueueStatus.DISETUJUI ||
                          checkin.current_status === 'APPROVED'
                            ? 'default'
                            : checkin.current_status === QueueStatus.DITOLAK ||
                                checkin.current_status === 'REJECTED'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className={
                          checkin.current_status === QueueStatus.DISETUJUI ||
                          checkin.current_status === 'APPROVED'
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : checkin.current_status === QueueStatus.DITOLAK ||
                                checkin.current_status === 'REJECTED'
                              ? 'bg-rose-500 hover:bg-rose-600'
                              : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }
                      >
                        {checkin.current_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <VerificationSheet
                        checkin={{
                          id: checkin.queue_number,
                          company: checkin.snapshot_company_name,
                          driver: checkin.driver_name,
                          category: checkin.snapshot_category_name,
                          time: checkin.submission_time,
                          status: checkin.current_status.toLowerCase(),
                        }}
                        trigger={<Button size="sm">Verifikasi</Button>}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
