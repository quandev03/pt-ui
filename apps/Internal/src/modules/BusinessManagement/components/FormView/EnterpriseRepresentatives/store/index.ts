import { create } from 'zustand';
export interface RepresentativeStore {
  isDisableCheckInfo: boolean;
  setIsDisableCheckInfo: (data: boolean) => void;
  authorizedFileName: string;
  setAuthorizedFileName: (fileName: string) => void;
  isAllowSave: boolean;
  setIsAllowSave: (isAllowSave: boolean) => void;
  resetStore: () => void;
}

const useRepresentativeStore = create<RepresentativeStore>((set) => ({
  isDisableCheckInfo: true,
  setIsDisableCheckInfo(data) {
    set(() => ({ isDisableCheckInfo: data }));
  },
  authorizedFileName: '',
  setAuthorizedFileName(fileName) {
    set(() => ({ authorizedFileName: fileName }));
  },
  isAllowSave: true,
  setIsAllowSave(isAllowSave) {
    set(() => ({ isAllowSave: isAllowSave }));
  },
  resetStore() {
    set(() => ({
      isDisableCheckInfo: true,
      isAllowSave: true,
    }));
  },
}));
export default useRepresentativeStore;
