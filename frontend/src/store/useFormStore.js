import { create } from "zustand";

export const useFormStore = create((set) => ({
  step: 1,
  basics: null,
  details: {},

  saveBasics: (basics) =>
    set((s) => ({
      basics,
      details: s.basics?.category === basics.category ? s.details : {},
      step: 2,
    })),

  saveDetails: (partial) =>
    set((s) => ({ details: { ...s.details, ...partial }, step: s.step + 1 })),

  back: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  reset: () => set({ step: 1, basics: null, details: {} }),
}));