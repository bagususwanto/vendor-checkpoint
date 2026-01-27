'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ChecklistCategoryList } from './components/checklist-category-list';
import { ChecklistCategoryDialog } from './components/checklist-category-dialog';
import { useQuery } from '@tanstack/react-query';
import { checklistService } from '@/services/checklist.service';
import { ChecklistCategoryResponse } from '@/types/checklist';

export default function ChecklistPage() {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ChecklistCategoryResponse | null>(null);

  const {
    data: categories,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['checklist-categories'],
    queryFn: checklistService.getAllCategories,
  });

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: ChecklistCategoryResponse) => {
    setSelectedCategory(category);
    setIsCategoryDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsCategoryDialogOpen(false);
    refetch();
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Checklist</h2>
          <p className="text-muted-foreground text-sm">
            Kelola data master checklist (kategori dan item).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Checklist</CardTitle>
          <CardDescription>
            Atur kategori dan item checklist. Geser untuk mengubah urutan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ChecklistCategoryList
              categories={categories || []}
              onEdit={handleEditCategory}
              onRefetch={refetch}
            />
          )}
        </CardContent>
      </Card>

      <ChecklistCategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
