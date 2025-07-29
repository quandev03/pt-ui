import { create } from 'zustand';
import { IGroupStore } from '../../CatrgoryReason/store';

export interface IActivationAssignedStore {
  clickSearch: boolean;
  setClickSearch: (data: boolean) => void;
  formAntd: any;
  setFormAntd: (data: any) => void;
}

export const useActivationAssignedStore = create<IActivationAssignedStore>((set) => ({
  clickSearch: false,
  setClickSearch(value) {
    set(()=> ({clickSearch: value}))
  },
  formAntd: null,
  setFormAntd(value) {
    set(() => ({ formAntd: value }));
  },
  
}));

export const useGroupStore = create<IGroupStore>((set) => ({
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
}));