import { create } from 'zustand';

export type Step1Data = {
  fullName: string;
  company: {
    value: string;
    label: string; // This is the company name
  };
  materialCategory: {
    value: string;
    label: string;
    description?: string;
  };
};

type Step2Data = {
  checklistItems: Record<string, string>;
};

export type SuccessData = {
  queueNumber: string;
  companyName: string;
  driverName: string;
  status_display_text: string;
  estimatedWaitMinutes: number;
  submitTime: string;
};

export type ChecklistItem = {
  checklist_item_id: number;
  item_text: string;
  item_type: string;
  is_required: boolean;
  material_category_id?: number | null;
  display_order?: number;
  material_category?: {
    category_name: string;
  } | null;
};

export type ChecklistCategoryData = {
  checklist_category_id: number;
  category_name: string;
  display_order: number;
  icon_name?: string | null;
  color_code?: string | null;
  mst_checklist_item?: ChecklistItem[];
};

type CheckListStore = {
  step1Data: Step1Data | null;
  step2Data: Step2Data | null;
  successData: SuccessData | null;
  checklistCategories: ChecklistCategoryData[] | null;
  clearChecklistData: () => void;
  resetFormData: () => void;
  setStep1Data: (data: Step1Data) => void;
  setStep2Data: (data: Step2Data) => void;
  setSuccessData: (data: SuccessData) => void;
  setChecklistCategories: (data: ChecklistCategoryData[]) => void;
};

export const useChecklistStore = create<CheckListStore>((set) => ({
  step1Data: null,
  step2Data: null,
  successData: null,
  checklistCategories: null,
  clearChecklistData: () =>
    set({
      step1Data: null,
      step2Data: null,
      successData: null,
      checklistCategories: null,
    }),
  resetFormData: () =>
    set({ step1Data: null, step2Data: null, checklistCategories: null }),
  setStep1Data: (data) => set({ step1Data: data }),
  setStep2Data: (data) => set({ step2Data: data }),
  setSuccessData: (data) => set({ successData: data }),
  setChecklistCategories: (data) => set({ checklistCategories: data }),
}));
