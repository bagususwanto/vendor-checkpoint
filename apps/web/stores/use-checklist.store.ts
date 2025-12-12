import { create } from 'zustand';

type Step1Data = {
  fullName: string;
  company: {
    value: string;
    category: string;
    vendorCode: string;
  };
};

type Step2Data = {
  checklistItems: string[];
};

type ChecklistStore = {
  step1Data: Step1Data | null;
  step2Data: Step2Data | null;
  clearChecklistData: () => void;
  setStep1Data: (data: Step1Data) => void;
  setStep2Data: (data: Step2Data) => void;
};

export const useChecklistStore = create<ChecklistStore>((set) => ({
  step1Data: null,
  step2Data: null,
  clearChecklistData: () => set({ step1Data: null, step2Data: null }),
  setStep1Data: (data) => set({ step1Data: data }),
  setStep2Data: (data) => set({ step2Data: data }),
}));
