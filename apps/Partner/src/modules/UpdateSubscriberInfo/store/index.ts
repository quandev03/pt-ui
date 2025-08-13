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
  degreeUrl: string | undefined;
  setDegreeUrl: (url: string) => void;
  interval: AnyElement;
  setIntervalApi: (data: AnyElement) => void;
  agreeDegree13: number[];
  setAgreeDegree13: (data: number[]) => void;
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
    degreeUrl: undefined,
    setDegreeUrl(url) {
      set(() => ({ degreeUrl: url }));
    },
    interval: undefined,
    setIntervalApi(value) {
      set(() => ({ interval: value }));
    },
    agreeDegree13: [1, 2, 3, 4, 5],
    setAgreeDegree13(data) {
      set(() => ({ agreeDegree13: data }));
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
