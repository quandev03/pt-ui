import { create } from 'zustand';
import { ISinglePackageSalePayload } from '../types';

interface SellSinglePackageState {
  // We will store the payload here, without the pinCode
  salePayload: Omit<ISinglePackageSalePayload, 'id'> | null;
  // Action to set the payload
  setSalePayload: (
    payload: Omit<ISinglePackageSalePayload, 'id'> | null
  ) => void;
}

export const useSellSinglePackageStore = create<SellSinglePackageState>(
  (set) => ({
    salePayload: null,
    setSalePayload: (payload) => set({ salePayload: payload }),
  })
);
