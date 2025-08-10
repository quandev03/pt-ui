import { create } from 'zustand';
import { OcrResponse, StepEnum } from '../type';

interface IUpdateSubscriberInfoStore {
  step: number;
  setStep: (step: number) => void;
  ocrResponse: OcrResponse | undefined;
  setOcrResponse: (data: OcrResponse) => void;
  contractUrl: string | undefined;
  setContractUrl: (url: string) => void;
}

export const useUpdateSubscriberInfoStore = create<IUpdateSubscriberInfoStore>(
  (set) => ({
    step: StepEnum.STEP1,
    setStep(step) {
      set(() => ({ step: step }));
    },
    ocrResponse: undefined,
    setOcrResponse(data) {
      set(() => ({ ocrResponse: data }));
    },
    contractUrl: undefined,
    setContractUrl(url) {
      set(() => ({ contractUrl: url }));
    },
  })
);
