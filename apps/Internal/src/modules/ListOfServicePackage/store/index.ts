import { create } from 'zustand';
import { IPackageGroup } from '../types';

export interface IPackageServiceStore {
  isValuesChanged: boolean;
  packageGroups: IPackageGroup[];
  setIsValuesChanged: (isChanged: boolean) => void;
  setPackageGroups: (groups: IPackageGroup[]) => void;
  resetPackageServiceStore: () => void;
}

const usePackageServiceStore = create<IPackageServiceStore>((set) => ({
  isValuesChanged: false,
  packageGroups: [],
  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },
  setPackageGroups(groups) {
    set(() => ({
      packageGroups: groups,
    }));
  },
  resetPackageServiceStore() {
    set(() => ({
      isValuesChanged: false,
    }));
  },
}));
export default usePackageServiceStore;
