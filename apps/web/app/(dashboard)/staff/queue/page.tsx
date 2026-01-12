'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useVerificationList } from '@/hooks/api/use-check-in';
import { useDebounce } from '../../../../hooks/use-debounce';
import { useMaterialCategories } from '@/hooks/api/use-material-categories';
import { DateRange } from 'react-day-picker';
import { QueueHeader } from './components/queue-header';
import { QueueToolbar } from './components/queue-toolbar';
import { QueueTable } from './components/queue-table';

export default function QueuePage() {
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
      status: status || undefined,
    },
  );

  const checkins = data?.data || [];
  const meta: any = data?.meta;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setDate(undefined);
    setCategoryId('');
    setStatus('');
    setPage(1);
  };

  // Robust fallback for total pages
  const totalPages = meta?.last_page || meta?.lastPage || meta?.pageCount || 1;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <QueueHeader />

      <QueueToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        date={date}
        setDate={(d) => {
          setDate(d);
          setPage(1);
        }}
        status={status}
        setStatus={(s) => {
          setStatus(s);
          setPage(1);
        }}
        categoryId={categoryId}
        setCategoryId={(c) => {
          setCategoryId(c);
          setPage(1);
        }}
        categories={categories}
        onReset={handleReset}
      />

      <QueueTable
        checkins={checkins}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
}
