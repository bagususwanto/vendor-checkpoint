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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Filter, Search, X } from 'lucide-react';
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

  const checkins = data?.data || [];
  const meta: any = data?.meta; // Type assertion to bypass potential type mismatch for now

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const handleReset = () => {
    setSearchTerm('');
    setDate(undefined);
    setCategoryId('');
    setStatus('');
    setPage(1);
  };

  const totalPages = meta?.last_page || meta?.lastPage || meta?.pageCount || 1; // Robust fallback

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Verifikasi</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Cari driver, perusahaan..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-wrap">
          <DatePickerWithRange
            date={date}
            setDate={(d) => {
              setDate(d);
              setPage(1);
            }}
            className="w-full sm:w-[250px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start"
              >
                <Filter className="mr-2 h-4 w-4" />
                {status
                  ? status === QueueStatus.DISETUJUI
                    ? 'Disetujui'
                    : status === QueueStatus.DITOLAK
                      ? 'Ditolak'
                      : 'Menunggu'
                  : 'Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={(val) => {
                  setStatus(val);
                  setPage(1);
                }}
              >
                <DropdownMenuRadioItem value="">
                  Semua Status
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={QueueStatus.DISETUJUI}>
                  Disetujui
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={QueueStatus.DITOLAK}>
                  Ditolak
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={QueueStatus.MENUNGGU}>
                  Menunggu
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-start"
              >
                <Filter className="mr-2 h-4 w-4" />
                {categoryId
                  ? categories?.pages
                      .flatMap((p) => p.data)
                      .find(
                        (c) => String(c.material_category_id) === categoryId,
                      )?.category_name || 'Kategori'
                  : 'Kategori'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Kategori</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={categoryId}
                onValueChange={(val) => {
                  setCategoryId(val);
                  setPage(1);
                }}
              >
                <DropdownMenuRadioItem value="">
                  Semua Kategori
                </DropdownMenuRadioItem>
                {categories?.pages
                  .flatMap((page) => page.data)
                  .map((category) => (
                    <DropdownMenuRadioItem
                      key={category.material_category_id}
                      value={String(category.material_category_id)}
                    >
                      {category.category_name}
                    </DropdownMenuRadioItem>
                  ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {(searchTerm || date || status || categoryId) && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
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
