'use client';

import { useState, useEffect } from 'react';
import { ChecklistItemResponse } from '@/types/checklist';
import { Button } from '@/components/ui/button';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import { checklistService } from '@/services/checklist.service';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ChecklistItemType } from '@repo/types';
import { DeleteDialog } from '@/components/delete-dialog';

interface ChecklistItemListProps {
  items: ChecklistItemResponse[];
  onEdit: (item: ChecklistItemResponse) => void;
  onRefetch: () => void;
}

export function ChecklistItemList({
  items: initialItems,
  onEdit,
  onRefetch,
}: ChecklistItemListProps) {
  const [items, setItems] = useState(initialItems);
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    id: number | null;
    text: string;
  }>({ open: false, id: null, text: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleReorder = async (newOrder: ChecklistItemResponse[]) => {
    setItems(newOrder);
    try {
      await checklistService.reorderItems({
        items: newOrder.map((item, index) => ({
          id: item.checklist_item_id,
          display_order: index + 1,
        })),
      });
    } catch (error) {
      toast.error('Gagal menyimpan urutan item');
      onRefetch();
    }
  };

  const handleDelete = (item: ChecklistItemResponse) => {
    setDeleteDialogState({
      open: true,
      id: item.checklist_item_id,
      text: item.item_text,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialogState.id) return;

    try {
      setIsDeleting(true);
      await checklistService.deleteItem(deleteDialogState.id);
      toast.success('Item berhasil dihapus');
      setDeleteDialogState((prev) => ({ ...prev, open: false }));
      onRefetch();
    } catch (error) {
      toast.error('Gagal menghapus item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-2"
      >
        {items.map((item) => (
          <ChecklistItem
            key={item.checklist_item_id}
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground italic py-2">
            Belum ada item checklist.
          </div>
        )}
      </Reorder.Group>

      <DeleteDialog
        open={deleteDialogState.open}
        onOpenChange={(open) =>
          setDeleteDialogState((prev) => ({ ...prev, open }))
        }
        onConfirm={handleConfirmDelete}
        title="Hapus Item Checklist"
        description={
          <span>
            Apakah Anda yakin ingin menghapus item{' '}
            <span className="font-semibold">"{deleteDialogState.text}"</span>?
          </span>
        }
        isDeleting={isDeleting}
      />
    </>
  );
}

function ChecklistItem({
  item,
  onEdit,
  onDelete,
}: {
  item: ChecklistItemResponse;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center p-3 rounded-md border bg-muted/30"
    >
      <div
        className="cursor-move mr-3 text-muted-foreground"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1 flex items-center gap-2">
        <span className="font-medium text-sm">{item.item_text}</span>
        <Badge variant="outline" className="text-xs">
          {item.item_type}
        </Badge>
        {item.item_type === ChecklistItemType.KHUSUS &&
          item.material_category && (
            <Badge variant="secondary" className="text-xs bg-muted">
              {item.material_category.category_name}
            </Badge>
          )}
        {item.is_required && (
          <Badge variant="secondary" className="text-xs">
            Wajib
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </Reorder.Item>
  );
}
