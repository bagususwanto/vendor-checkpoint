'use client';

import { useState } from 'react';
import { columns } from './columns';
import { MaterialCategoriesTable } from './material-categories-table';
import { MaterialCategoryDialog } from './material-category-dialog';
import {
  useMaterialCategories,
  useCreateMaterialCategory,
  useUpdateMaterialCategory,
  useDeleteMaterialCategory,
  useBulkDeleteMaterialCategories,
} from '@/hooks/api/use-material-categories';
import { MaterialCategoryResponse } from '@repo/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function MaterialCategoryPage() {
  // State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<MaterialCategoryResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);

  // Hooks
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useMaterialCategories({
      page,
      limit,
      search,
      status: status as 'all' | 'active' | 'inactive',
    });

  const createMutation = useCreateMaterialCategory();
  const updateMutation = useUpdateMaterialCategory();
  const deleteMutation = useDeleteMaterialCategory();
  const bulkDeleteMutation = useBulkDeleteMaterialCategories();

  // Handlers
  const handleAdd = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: MaterialCategoryResponse) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: MaterialCategoryResponse) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleBulkDelete = (ids: number[]) => {
    setRowsToDelete(ids);
    setIsBulkDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({
          id: selectedCategory.material_category_id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      try {
        await deleteMutation.mutateAsync(selectedCategory.material_category_id);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync({ ids: rowsToDelete });
      setIsBulkDeleteDialogOpen(false);
      setRowsToDelete([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Kategori Material
          </h2>
          <p className="text-muted-foreground text-sm">
            Kelola data master kategori material untuk keperluan operasional.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori Material</CardTitle>
          <CardDescription>
            Tabel berikut menampilkan semua kategori material yang tersedia
            dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <MaterialCategoriesTable
            columns={columns(handleEdit, handleDelete)}
            data={categoriesData?.data || []}
            total={categoriesData?.meta.total || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onAdd={handleAdd}
            onBulkDelete={handleBulkDelete}
            statusFilter={status}
            onStatusFilterChange={setStatus}
            globalFilter={search}
            onGlobalFilterChange={setSearch}
          />
        </CardContent>
      </Card>

      {/* Dialog Create/Edit */}
      <MaterialCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Alert Dialog Delete Single */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus kategori{' '}
              <span className="font-semibold">
                {selectedCategory?.category_name}
              </span>
              . Jika kategori sudah memiliki data terkait, kategori akan
              dinonaktifkan alih-alih dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive focus:ring-destructive"
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog Bulk Delete */}
      <AlertDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus {rowsToDelete.length} kategori yang
              dipilih. Kategori yang sudah memiliki data terkait akan
              dinonaktifkan alih-alih dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulkDelete}
              className="bg-destructive focus:ring-destructive"
            >
              {bulkDeleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
