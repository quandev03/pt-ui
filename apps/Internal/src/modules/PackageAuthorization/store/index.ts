import { IModeAction } from '@react/commons/types';
import { create } from 'zustand';
import { IPackItem } from '../types';

export interface IPackageAuthorizationStore {
  actionMode: IModeAction;
  packageAuthorizationDetail: IPackItem;
  idpackageAuthorizationDetail: string;
  isValuesChanged: boolean;
  saveForm: boolean;
  setIsValuesChanged: (isValuesChanged: boolean) => void;
  setIdpackageAuthorizationDetail: (id: string) => void;
  setActionMode: (mode: IModeAction) => void;
  setPackageAuthorizationDetail: (item: IPackItem) => void;
  resetGroupStore: () => void;
  setSaveForm: () => void;
}

const usePackageAuthorizationStore = create<IPackageAuthorizationStore>((set) => ({
  actionMode: '',
  packageAuthorizationDetail: {} as IPackItem,
  idpackageAuthorizationDetail: '',
  isValuesChanged: false,
  saveForm: false,
  setIsValuesChanged(isValuesChanged) {
    set(() => ({ isValuesChanged }));
  },
  setIdpackageAuthorizationDetail(id) {
    set(() => ({ idpackageAuthorizationDetail: id }));
  },
  setActionMode(mode) {
    set(() => ({ actionMode: mode }));
  },
  setPackageAuthorizationDetail(item) {
    set(() => ({ packageAuthorizationDetail: item }));
  },
  setSaveForm() {
    set((state: IPackageAuthorizationStore) => ({ saveForm: !state.saveForm }));
  },
  resetGroupStore() {
    set(() => ({
      actionMode: '',
      packageAuthorizationDetail: {} as IPackItem,
      isValuesChanged: false,
      idpackageAuthorizationDetail: '',
    }));
  },
}));
export default usePackageAuthorizationStore;
