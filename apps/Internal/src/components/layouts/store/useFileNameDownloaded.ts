import { create } from 'zustand';

export interface IGroupStore {
  name: string;
  setName: (value: string) => void;
}

const useFileNameDownloaded = create<IGroupStore>((set) => ({
  name: '',
  setName(name) {
    set(() => ({ name }));
  },
}));
export default useFileNameDownloaded;
