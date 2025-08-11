import { create } from 'zustand';
import { OcrResponse, StepEnum } from '../type';
import { AnyElement } from '@vissoft-react/common';

interface IUpdateSubscriberInfoStore {
  step: number;
  setStep: (step: number) => void;
  ocrResponse: OcrResponse | undefined;
  setOcrResponse: (data: OcrResponse | undefined) => void;
  contractUrl: string | undefined;
  setContractUrl: (url: string) => void;
  interval: AnyElement;
  setIntervalApi: (data: AnyElement) => void;
  resetStore: () => void;
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
    interval: undefined,
    setIntervalApi(value) {
      set(() => ({ interval: value }));
    },
    resetStore() {
      set(() => ({
        step: StepEnum.STEP1,
        ocrResponse: undefined,
        interval: undefined,
        contractUrl: undefined,
      }));
    },
  })
);
