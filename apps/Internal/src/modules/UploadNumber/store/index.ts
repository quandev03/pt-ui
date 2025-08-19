import { create } from "zustand";
export interface IUploadNumberStore {
    isOpenModalApprovalProgress: boolean
    setIsOpenModalApprovalProgress: (isOpenModalApprovalProgress: boolean) => void
    resetGroupStore: () => void
}
const useUploadNumberStore = create<IUploadNumberStore>((set) => ({
    isOpenModalApprovalProgress: false,
    setIsOpenModalApprovalProgress(isOpenModalApprovalProgress) {
        set(() => ({
            isOpenModalApprovalProgress
        }));
    },
    resetGroupStore() {
        set(() => ({
            isOpenModalApprovalProgress: false
        }));
    },
}));
export default useUploadNumberStore;
