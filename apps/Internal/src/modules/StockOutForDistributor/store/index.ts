import { create } from "zustand";
import { IDataOrder } from "../../Order/types";
import { ACTION_MODE_ENUM } from "@react/commons/types";

interface IStoreStockOutForDistributorck {
    actionMode: ACTION_MODE_ENUM,
    sttRecord: number;
    detailOrderSale: IDataOrder,
    setActionMode: (type: ACTION_MODE_ENUM) => void
    setSttRecord: (stt: number) => void
    setDetailOrderSale: (detailOrderSale: IDataOrder) => void
    resetGroupStore: () => void
}
const useStoreStockOutForDistributorck = create<IStoreStockOutForDistributorck>((set) => ({
    sttRecord: 0,
    actionMode: "" as ACTION_MODE_ENUM,
    detailOrderSale: {} as IDataOrder,
    setActionMode: (type) => set(() => ({ actionMode: type })),
    setDetailOrderSale: (detailOrderSale) => set(() => ({ detailOrderSale: detailOrderSale })),
    setSttRecord: (stt) => set(() => ({ sttRecord: stt })),
    resetGroupStore() {
        set(() => ({
            detailOrderSale: {} as IDataOrder,
            actionMode: "" as ACTION_MODE_ENUM,
        }));
    },
}));
export default useStoreStockOutForDistributorck;