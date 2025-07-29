import { Key } from 'react';
import { create } from 'zustand';

export interface ISubscriptionStore {
  isIdentification: boolean;
  subscriberId: string;
  historyId: string;
  subscriberNoImpactIds: Key[];
  setIsIdentification: (value: boolean) => void;
  setSubscriberId: (value?: string) => void;
  setHistoryId: (value?: string) => void;
  setSubscriberNoImpactIds: (value?: Key[]) => void;
}

const useSubscriptionStore = create<ISubscriptionStore>((set) => ({
  isIdentification: false,
  subscriberId: '',
  historyId: '',
  subscriberNoImpactIds: [],

  setIsIdentification: (value) => set(() => ({ isIdentification: value })),
  setSubscriberId: (value) => set(() => ({ subscriberId: value })),
  setHistoryId: (value) => set(() => ({ historyId: value })),
  setSubscriberNoImpactIds: (value) =>
    set(() => ({ subscriberNoImpactIds: value })),
}));

export default useSubscriptionStore;
