import {
  CreateChecklistCategory,
  CreateChecklistItem,
  UpdateChecklistCategory,
  UpdateChecklistItem,
  Reorder,
  ChecklistItemType,
} from '@repo/types';

export type {
  CreateChecklistCategory,
  CreateChecklistItem,
  UpdateChecklistCategory,
  UpdateChecklistItem,
  Reorder,
  ChecklistItemType,
};

export type ChecklistItemResponse = {
  checklist_item_id: number;
  checklist_category_id: number;
  item_code: string;
  item_text: string;
  item_type: ChecklistItemType;
  material_category_id?: number | null;
  display_order: number;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  material_category?: {
    material_category_id: number;
    category_name: string;
  } | null;
};

export type ChecklistCategoryResponse = {
  checklist_category_id: number;
  category_name: string;
  category_code: string;
  display_order: number;
  icon_name?: string | null;
  color_code?: string | null;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  mst_checklist_item?: ChecklistItemResponse[];
};
