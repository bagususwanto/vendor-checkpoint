'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { VendorTable } from './components/vendor-table';
import { VendorToolbar } from './components/vendor-toolbar';
import { useVendorsPaginated } from '@/hooks/api/use-vendors';
import { useDebounce } from '@/hooks/use-debounce';

export default function VendorListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialLimit = Number(searchParams.get('limit')) || 10;
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || 'all';

  // State
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 300);

  // Build query params for API
  const queryParams = {
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive:
      status === 'active' ? true : status === 'inactive' ? false : undefined,
  };

  // Fetch vendors
  const { data, isLoading } = useVendorsPaginated(queryParams);

  // Update URL when params change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (limit !== 10) params.set('limit', String(limit));
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);

    const queryString = params.toString();
    router.replace(queryString ? `?${queryString}` : '', { scroll: false });
  }, [page, limit, search, status, router]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleReset = () => {
    setSearch('');
    setStatus('all');
    setPage(1);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Daftar Vendor</h2>
      </div>

      <div className="space-y-4">
        <VendorToolbar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          onReset={handleReset}
        />

        <VendorTable
          vendors={data?.data || []}
          isLoading={isLoading}
          page={page}
          totalPages={data?.meta.total_pages || 1}
          total={data?.meta.total || 0}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}
