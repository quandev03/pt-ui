import { create } from 'zustand';
import { paramsDefault, ParamsSerialLookup } from '../types';

export interface IUserStore {
  params: ParamsSerialLookup;

  setParamSearch: (mode: ParamsSerialLookup) => void;
}

const useStore = create<IUserStore>((set) => ({
  params: paramsDefault,

  setParamSearch(mode) {
    set(() => ({ params: mode }));
  },
}));
export default useStore;
