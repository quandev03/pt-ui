import { create } from 'zustand';

export interface IGroupStore {
  isAutoDefault: boolean;
  setIsAutoDefault: (isDefault: boolean) => void;
  isValuesChanged: boolean;
  setIsValuesChanged: (isChanged: boolean) => void;
  resetGroupStore: () => void;
}

const useGroupStore = create<IGroupStore>((set) => ({
  isAutoDefault: false,
  setIsAutoDefault(isDefault) {
    set(() => ({ isAutoDefault: isDefault }));
  },

  isValuesChanged: false,
  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },

  resetGroupStore() {
    set(() => ({
      isValuesChanged: false,
      isAutoDefault: false,
    }));
  },
}));
export default useGroupStore;
