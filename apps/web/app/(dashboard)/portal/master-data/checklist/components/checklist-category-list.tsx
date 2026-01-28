'use client';

import { useState, useEffect } from 'react';
import {
  ChecklistCategoryResponse,
  ChecklistItemResponse,
} from '@/types/checklist';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import { checklistService } from '@/services/checklist.service';
import { toast } from 'sonner';
import { ChecklistItemDialog } from './checklist-item-dialog';
import { ChecklistItemList } from './checklist-item-list';
import { DeleteDialog } from '@/components/delete-dialog';

interface ChecklistCategoryListProps {
  categories: ChecklistCategoryResponse[];
  onEdit: (category: ChecklistCategoryResponse) => void;
  onRefetch: () => void;
}

export function ChecklistCategoryList({
  categories,
  onEdit,
  onRefetch,
}: ChecklistCategoryListProps) {
  const [items, setItems] = useState(categories);
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const [selectedCategoryForNewItem, setSelectedCategoryForNewItem] =
    useState<ChecklistCategoryResponse | null>(null);
  const [itemDialogState, setItemDialogState] = useState<{
    open: boolean;
    item: ChecklistItemResponse | null;
    categoryId: number | null;
  }>({ open: false, item: null, categoryId: null });
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    id: number | null;
    name: string;
  }>({ open: false, id: null, name: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  const handleReorder = async (newOrder: ChecklistCategoryResponse[]) => {
    setItems(newOrder);
    try {
      await checklistService.reorderCategories({
        items: newOrder.map((item, index) => ({
          id: item.checklist_category_id,
          display_order: index + 1,
        })),
      });
      // Silent success or toast? Maybe silent for drag and drop
    } catch (error) {
      toast.error('Gagal menyimpan urutan kategori');
      // Revert?
      onRefetch();
    }
  };

  const toggleOpen = (id: number) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (category: ChecklistCategoryResponse) => {
    setDeleteDialogState({
      open: true,
      id: category.checklist_category_id,
      name: category.category_name,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialogState.id) return;

    try {
      setIsDeleting(true);
      await checklistService.deleteCategory(deleteDialogState.id);
      toast.success('Kategori berhasil dihapus');
      setDeleteDialogState((prev) => ({ ...prev, open: false }));
      onRefetch();
    } catch (error) {
      toast.error('Gagal menghapus kategori');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddItem = (categoryId: number) => {
    setItemDialogState({ open: true, item: null, categoryId });
  };

  const handleEditItem = (item: ChecklistItemResponse) => {
    setItemDialogState({
      open: true,
      item,
      categoryId: item.checklist_category_id,
    });
  };

  const handleItemSuccess = () => {
    setItemDialogState({ open: false, item: null, categoryId: null });
    onRefetch();
  };

  return (
    <div className="space-y-4">
      <Reorder.Group axis="y" values={items} onReorder={handleReorder}>
        {items.map((category) => (
          <ChecklistCategoryItem
            key={category.checklist_category_id}
            category={category}
            isOpen={openItems[category.checklist_category_id] ?? false}
            onToggle={() => toggleOpen(category.checklist_category_id)}
            onEdit={() => onEdit(category)}
            onDelete={() => handleDelete(category)}
            onAddItem={() => handleAddItem(category.checklist_category_id)}
            onEditItem={handleEditItem}
            onRefetch={onRefetch}
          />
        ))}
      </Reorder.Group>

      <ChecklistItemDialog
        open={itemDialogState.open}
        onOpenChange={(open) =>
          setItemDialogState((prev) => ({ ...prev, open }))
        }
        categoryId={itemDialogState.categoryId}
        item={itemDialogState.item}
        onSuccess={handleItemSuccess}
      />

      <DeleteDialog
        open={deleteDialogState.open}
        onOpenChange={(open) =>
          setDeleteDialogState((prev) => ({ ...prev, open }))
        }
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori Checklist"
        description={
          <span>
            Apakah Anda yakin ingin menghapus kategori{' '}
            <span className="font-semibold">"{deleteDialogState.name}"</span>?
            Aksi ini tidak dapat dibatalkan dan akan menghapus semua item di
            dalamnya.
          </span>
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}

function ChecklistCategoryItem({
  category,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onAddItem,
  onEditItem,
  onRefetch,
}: {
  category: ChecklistCategoryResponse;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddItem: () => void;
  onEditItem: (item: ChecklistItemResponse) => void;
  onRefetch: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={category}
      dragListener={false}
      dragControls={dragControls}
      className="mb-4 rounded-md border bg-secondary"
    >
      <div className="flex items-center p-4">
        <div
          className="cursor-move mr-4 text-muted-foreground"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <Collapsible open={isOpen} onOpenChange={onToggle} className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto w-auto">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              {category.icon_name && (Icons as any)[category.icon_name] && (
                <div className={category.color_code || ''}>
                  {(() => {
                    const Icon = (Icons as any)[category.icon_name!];
                    return <Icon className="h-4 w-4" />;
                  })()}
                </div>
              )}
              <span className="font-semibold">{category.category_name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({category.mst_checklist_item?.length || 0} item)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onAddItem}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CollapsibleContent className="mt-4 pl-8">
            <ChecklistItemList
              items={category.mst_checklist_item || []}
              onEdit={onEditItem}
              onRefetch={onRefetch}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Reorder.Item>
  );
}
