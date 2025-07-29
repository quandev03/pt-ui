import { create } from 'zustand';
export interface BusinessManagementStore {
  formAntd: any;
  setFormAntd: (data: any) => void;
  positionCode: null | number;
  setPositionCode: (data: null | number) => void;
  changedFields: string[];
  setChangedFields: (changedFields: string[]) => void;
}

const useStoreBusinessManagement = create<BusinessManagementStore>((set) => ({
  formAntd: null,
  setFormAntd(value) {
    set(() => ({ formAntd: value }));
  },
  positionCode: null,
  setPositionCode(value) {
    set(() => ({ positionCode: value }));
  },
  changedFields: [],
  setChangedFields(changedFields) {
    set(() => ({ changedFields: changedFields }));
  },
}));
export default useStoreBusinessManagement;
