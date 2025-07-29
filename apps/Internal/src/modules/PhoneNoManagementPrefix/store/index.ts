import { create } from 'zustand';

export interface IGroupStore {
  isValuesChanged: boolean;
  setIsValuesChanged: (isChanged: boolean) => void;
  resetGroupStore: () => void;
}

const useGroupStore = create<IGroupStore>((set) => ({
  isValuesChanged: false,

  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },

  resetGroupStore() {
    set(() => ({
      isValuesChanged: false,
    }));
  },
}));
export default useGroupStore;
