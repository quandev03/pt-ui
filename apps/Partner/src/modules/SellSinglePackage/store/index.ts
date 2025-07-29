import { create } from "zustand";
import { IPayloadConfirmOtp } from "../type";

interface ISellSinglePackageStore {
    dataGenOtp: IPayloadConfirmOtp;
    count: number;
    setCount: (count: number) => void;
    setDataGenOtp: (data: IPayloadConfirmOtp) => void;
    reset: () => void;
}

export const useSellSinglePackageStore = create<ISellSinglePackageStore>((set) => ({
    dataGenOtp: {} as IPayloadConfirmOtp,
    count: 0,
    setCount: (count: number) => {
        set({ count });
    },
    setDataGenOtp: (data: IPayloadConfirmOtp) => {
        set({ dataGenOtp: data });
    },
    reset: () => set({ count: 0, dataGenOtp: {} as IPayloadConfirmOtp }),
}));
