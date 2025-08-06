import { create } from 'zustand';
import { StepEnum } from '../type';

interface IUpdateSubscriberInfoStore {
  step: number;
  setStep: (step: number) => void;
}

export const useUpdateSubscriberInfoStore = create<IUpdateSubscriberInfoStore>(
  (set) => ({
    step: StepEnum.STEP1,
    setStep(step) {
      set(() => ({ step: step }));
    },
  })
);
