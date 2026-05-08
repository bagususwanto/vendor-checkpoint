'use client';

import { useState } from 'react';
import { columns } from './components/columns';
import { VendorCategoriesTable } from './components/vendor-categories-table';
import { VendorCategoryDialog } from './components/vendor-category-dialog';
import {
  useVendorCategories,
  useCreateVendorCategory,
  useUpdateVendorCategory,
  useDeleteVendorCategory,
  useBulkDeleteVendorCategories,
} from '@/hooks/api/use-vendor-categories';
import { VendorCategoryResponse } from '@repo/types';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@repo/types';
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

export default function VendorCategoryPage() {
  // State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<VendorCategoryResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);

  // Hooks
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useVendorCategories({
      page,
      limit,
      search,
      status: status as 'all' | 'active' | 'inactive',
    });

  const createMutation = useCreateVendorCategory();
  const updateMutation = useUpdateVendorCategory();
  const deleteMutation = useDeleteVendorCategory();
  const bulkDeleteMutation = useBulkDeleteVendorCategories();

  // Handlers
  const handleAdd = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: VendorCategoryResponse) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: VendorCategoryResponse) => {
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
          id: selectedCategory.vendor_category_id,
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
        await deleteMutation.mutateAsync(selectedCategory.vendor_category_id);
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
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.GROUP_HEAD,
        UserRole.LINE_HEAD,
      ]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Vendor Categories</h2>
            <p className="text-muted-foreground text-sm">
              Manage master data for vendor categories for operational purposes.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Category List</CardTitle>
            <CardDescription>
              The following table displays all vendor categories available in
              the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <VendorCategoriesTable
              columns={columns(handleEdit, handleDelete)}
              data={categoriesData?.data || []}
              total={categoriesData?.meta.total || 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
              onBulkDelete={handleBulkDelete}
              statusFilter={status}
              onStatusFilterChange={setStatus}
              globalFilter={search}
              onGlobalFilterChange={setSearch}
            />
          </CardContent>
        </Card>

        {/* Dialog Create/Edit */}
        <VendorCategoryDialog
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
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete category{' '}
                <span className="font-semibold">
                  {selectedCategory?.category_name}
                </span>
                . If the category already has related data, it will be
                deactivated instead of permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive focus:ring-destructive"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will delete {rowsToDelete.length} selected
                categories. Categories that already have related data will be
                deactivated instead of permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmBulkDelete}
                className="bg-destructive focus:ring-destructive"
              >
                {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RoleGuard>
  );
}

