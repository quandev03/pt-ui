import { create } from 'zustand';
import { IPayloadConfirmOtp } from '../type';

interface ITopupAssignPackageStore {
  dataGenOtp: IPayloadConfirmOtp;
  count: number;
  file: File;
  setCount: (count: number) => void;
  setDataGenOtp: (data: IPayloadConfirmOtp) => void;
  setFile: (file: File) => void;
  reset: () => void;
}

export const useTopupAssignPackageStore = create<ITopupAssignPackageStore>(
  (set) => ({
    dataGenOtp: {} as IPayloadConfirmOtp,
    count: 0,
    file: {} as File,
    setCount: (count: number) => {
      set({ count });
    },
    setDataGenOtp: (data: IPayloadConfirmOtp) => {
      set({ dataGenOtp: data });
    },
    setFile: (file: File) => {
      set({ file });
    },
    reset: () =>
      set({ count: 0, dataGenOtp: {} as IPayloadConfirmOtp, file: {} as File }),
  })
);
