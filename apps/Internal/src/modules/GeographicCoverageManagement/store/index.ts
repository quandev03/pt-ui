import { FormInstance } from 'antd';
import { create } from 'zustand';

export interface IGeographicCoverageManagementStore {
  originalNationList: number[];
  setOriginalNationsList: (originalNationList: number[]) => void;
  formNations: FormInstance | null;
  setFormNations: (formNations: FormInstance) => void;
}
const useCoverageManagementStore = create<IGeographicCoverageManagementStore>(
  (set) => ({
    originalNationList: [],
    setOriginalNationsList(originalNationList) {
      set(() => ({ originalNationList: originalNationList }));
    },
    formNations: null,
    setFormNations: (formNations: FormInstance) => {
      set(() => ({ formNations }));
    },
  })
);
export default useCoverageManagementStore;
