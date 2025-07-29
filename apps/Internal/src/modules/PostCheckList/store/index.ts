import { AnyElement } from '@react/commons/types';
import { create } from 'zustand';
export interface IPostCheckListStore {
  isValuesChanged: boolean;
  isHiddenModelSelectedReview: boolean;
  isHiddenModalHistory: boolean;
  objectImage: AnyElement;
  subDocumentHistoryDTOS: any;
  idHistory: string;
  setIdHistory: (idHistory: string) => void;
  setSubDocumentHistoryDTOS: (subDocumentHistoryDTOS: any) => void;
  setObjectImage: (objectImage: AnyElement) => void
  setIsHiddenModalHistory: (isHiddenModalHistory: boolean) => void
  setIsHiddenModelSelectedReview: (isHiddenModelSelectedReview: boolean) => void
  setIsValuesChanged: (isChanged: boolean) => void;
  resetGroupStore: () => void;
}

const useStorePostCheckList = create<IPostCheckListStore>((set) => ({
  actionMode: '',
  isValuesChanged: false,
  isHiddenModelSelectedReview: false,
  isHiddenModalHistory: false,
  dataFakeTest: [],
  objectImage: {},
  subDocumentHistoryDTOS: [],
  idHistory: '',
  setIdHistory(idHistory) {
    set(() => ({ idHistory: idHistory }));
  },
  setSubDocumentHistoryDTOS(subDocumentHistoryDTOS) {
    set(() => ({ subDocumentHistoryDTOS: subDocumentHistoryDTOS }));
  },
  setObjectImage(objectImage) {
    set(() => ({ objectImage: objectImage }));
  },
  setIsHiddenModalHistory(isHiddenModalHistory) {
    set(() => ({ isHiddenModalHistory: isHiddenModalHistory }));
  },
  setIsHiddenModelSelectedReview(isHiddenModelSelectedReview) {
    set(() => ({ isHiddenModelSelectedReview: isHiddenModelSelectedReview }));
  },
  setIsValuesChanged(isChanged) {
    set(() => ({ isValuesChanged: isChanged }));
  },
  resetGroupStore() {
    set(() => ({
      idHistory: '',
      subDocumentHistoryDTOS: [],
      objectImage: {},
      isHiddenModelSelectedReview: false,
      isValuesChanged: false,
      isHiddenModalHistory: false,
    }));
  },
}));
export default useStorePostCheckList;
