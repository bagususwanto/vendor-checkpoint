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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Loader2, Pencil } from 'lucide-react';
import { useSystemConfigs } from '@/hooks/api/use-system-config';
import { SystemConfigResponse } from '@repo/types';
import { SystemConfigDialog } from './system-config-dialog';
import { useDebounce } from '@/hooks/use-debounce';
import { SystemConfigPagination } from './system-config-pagination';

export function SystemConfigList() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedConfig, setSelectedConfig] =
    useState<SystemConfigResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useSystemConfigs({
    page,
    limit,
    search: debouncedSearch,
  });

  const handleEdit = (config: SystemConfigResponse) => {
    setSelectedConfig(config);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari konfigurasi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada data konfigurasi
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((config) => (
                <TableRow key={config.config_id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{config.config_key}</span>
                      {config.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {config.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {config.config_value}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{config.config_type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {(config as any).user?.full_name || '-'}
                    <div className="text-xs text-muted-foreground">
                      {new Date(config.updated_at).toLocaleString('id-ID')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {config.is_editable && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(config)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SystemConfigPagination
        total={data?.meta.total || 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />

      <SystemConfigDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        config={selectedConfig}
      />
    </div>
  );
}
