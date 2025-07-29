import { create } from "zustand";

interface IOrganizationTransferStore {
  orgId: number | undefined;
  setOrgId: (orgId: number | undefined) => void;
  reset: () => void;
}

export const useOrganizationTransferStore = create<IOrganizationTransferStore>((set) => ({
  orgId: undefined,
  setOrgId: (orgId) => set({ orgId }),
  reset: () => set({ orgId: undefined }),
}))