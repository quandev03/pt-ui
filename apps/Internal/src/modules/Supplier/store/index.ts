import { create } from 'zustand';

export interface ISupplierStore {
  isValuesChanged: boolean;
  setIsValuesChanged: (isChanged: boolean) => void;
  resetStore: () => void;
}

const useSupplierStore = create<ISupplierStore>((set) => ({
  isValuesChanged: false,
  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },
  resetStore() {
    set(() => ({
      isValuesChanged: false,
    }));
  },
}));
export default useSupplierStore;
