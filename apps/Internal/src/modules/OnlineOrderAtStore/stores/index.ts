import { create } from 'zustand';
import { IOnlineOrderAtStoreManagement } from '../types';

export interface IOrderCSStore {
  isOpenRefundModal: boolean
  record: IOnlineOrderAtStoreManagement | null,
  openRefundModal: (record: IOnlineOrderAtStoreManagement) => void
  closeRefundModal: () => void
  isOpenCancelModal: boolean
  openCancelModal: (record: IOnlineOrderAtStoreManagement) => void
  closeCancelModal: () => void
}

const useOrderAtStore = create<IOrderCSStore>((set) => ({
  isOpenRefundModal: false,
  record: null,
  openRefundModal: (record: IOnlineOrderAtStoreManagement) => { set(() => ({ record, isOpenRefundModal: true })) },
  closeRefundModal: () => { set(() => ({ record: null, isOpenRefundModal: false })) },
  isOpenCancelModal: false,
  openCancelModal: (record: IOnlineOrderAtStoreManagement) => { set(() => ({ record, isOpenCancelModal: true })) },
  closeCancelModal: () => { set(() => ({ record: null, isOpenCancelModal: false })) },
}));
export default useOrderAtStore;
