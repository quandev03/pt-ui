import { create } from 'zustand';

export interface IGroupStore {
  isValuesChanged: boolean;
  searchValue: string;
  setIsValuesChanged: (isChanged: boolean) => void;
  resetGroupStore: () => void;
  setSearchValue: (text: string) => void;
}

const useGroupStore = create<IGroupStore>((set) => ({
  isValuesChanged: false,
  searchValue: '',
  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },

  resetGroupStore() {
    set(() => ({
      isValuesChanged: false,
    }));
  },
  setSearchValue(text) {
    set(() => ({ searchValue: text }));
  },
}));
export default useGroupStore;
