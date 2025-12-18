import { create } from 'zustand';

type Step1Data = {
  fullName: string;
  company: {
    value: string;
    label: string;
    category_name: string;
    category_id: number;
    vendorCode: string;
  };
};

type Step2Data = {
  checklistItems: Record<string, string>;
};

export type SuccessData = {
  queueNumber: string;
  companyName: string;
  driverName: string;
  status: string;
  submitTime: string;
};

type ChecklistStore = {
  step1Data: Step1Data | null;
  step2Data: Step2Data | null;
  successData: SuccessData | null;
  clearChecklistData: () => void;
  setStep1Data: (data: Step1Data) => void;
  setStep2Data: (data: Step2Data) => void;
  setSuccessData: (data: SuccessData) => void;
};

export const useChecklistStore = create<ChecklistStore>((set) => ({
  step1Data: null,
  step2Data: null,
  successData: null,
  clearChecklistData: () =>
    set({ step1Data: null, step2Data: null, successData: null }),
  setStep1Data: (data) => set({ step1Data: data }),
  setStep2Data: (data) => set({ step2Data: data }),
  setSuccessData: (data) => set({ successData: data }),
}));
