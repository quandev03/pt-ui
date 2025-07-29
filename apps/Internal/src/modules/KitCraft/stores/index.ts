import { create } from 'zustand';

export enum TypeCraftEnum {
  BY_ORDER = 'BY_ORDER',
  NON_BY_ORDER = 'NON_BY_ORDER',
}

export interface IActiveSubscriptStore {
  typeCraft: TypeCraftEnum;
  setTypeCraft: (typeCraft: TypeCraftEnum) => void;
  resetGroupStore: () => void;
}

const useKitCraft = create<IActiveSubscriptStore>((set) => ({
  typeCraft: TypeCraftEnum.NON_BY_ORDER,
  setTypeCraft(typeCraft) {
    set(() => ({ typeCraft }));
  },
  resetGroupStore() {
    set(() => ({
      typeCraft: TypeCraftEnum.NON_BY_ORDER,
    }));
  },
}));
export default useKitCraft;
