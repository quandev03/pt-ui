import { Key } from 'react';
import { create } from 'zustand';

export interface SubscriberStore {
  subId: string;
  subIds: Key[];
  setSubId: (value?: string) => void;
  setSubIds: (value?: Key[]) => void;
}

const useSubscriberStore = create<SubscriberStore>((set) => ({
  subId: '',
  subIds: [],
  setSubId: (value) => set(() => ({ subId: value })),
  setSubIds: (value) => set(() => ({ subIds: value })),
}));

export default useSubscriberStore;
