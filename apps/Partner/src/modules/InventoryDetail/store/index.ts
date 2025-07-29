import { create } from 'zustand';
import { paramsDefault, ParamsInventoryDetail } from '../types';

export interface IUserStore {
  params: ParamsInventoryDetail;

  setParamSearch: (mode: ParamsInventoryDetail) => void;
}

const useStore = create<IUserStore>((set) => ({
  params: paramsDefault,

  setParamSearch(mode) {
    set(() => ({ params: mode }));
  },
}));
export default useStore;
