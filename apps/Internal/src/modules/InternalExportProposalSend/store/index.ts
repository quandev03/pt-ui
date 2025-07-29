import { create } from 'zustand';
import { IItemProduct } from '../type';
interface IStoreInternalExportProposal {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    orgIds: string;
    setOrgIds: (orgIds: string) => void;
    isOpenModalApprovalProgress: boolean;
    setIsOpenModalApprovalProgress: (isOpenModalApprovalProgress: boolean) => void;
    keysProducts: number[];
    setKeysProducts: (keysProducts: number[]) => void;
    listProducts: IItemProduct[];
    setListProducts: (listProducts: IItemProduct[]) => void;
    reset: () => void;
}
const useStoreInternalExportProposal = create<IStoreInternalExportProposal>((set) => ({
    isOpen: false,
    keysProducts: [],
    listProducts: [{} as IItemProduct],
    isOpenModalApprovalProgress: false,
    orgIds: '',
    setIsOpenModalApprovalProgress(isOpenModalApprovalProgress) {
        set(() => ({
            isOpenModalApprovalProgress
        }));
    },
    setOrgIds:(orgIds: string) => set({ orgIds }),
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    setKeysProducts: (keysProducts: number[]) => set({ keysProducts }),
    setListProducts: (listProducts: IItemProduct[]) => set({ listProducts }),
    reset: () => set(
        {
            isOpen: false,
            keysProducts: [],
            listProducts: [{} as IItemProduct],
            isOpenModalApprovalProgress: false,
            orgIds:""
        }
    ),
}));
export default useStoreInternalExportProposal;
