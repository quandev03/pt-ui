import { create } from 'zustand';
import { IOnlineOrdersCSManagement } from '../types';

export interface IOrderCSStore {
  isOpenRefundModal: boolean;
  record: IOnlineOrdersCSManagement | null;
  openRefundModal: (record: IOnlineOrdersCSManagement) => void;
  closeRefundModal: () => void;
  isOpenCancelModal: boolean;
  openCancelModal: (record: IOnlineOrdersCSManagement) => void;
  closeCancelModal: () => void;
  isOpenSendQrESIM: boolean;
  openSendQrESIMModal: (record: IOnlineOrdersCSManagement) => void;
  closeSendQrESIMModal: () => void;
}

const useOrderCSStore = create<IOrderCSStore>((set) => ({
  isOpenRefundModal: false,
  record: null,
  openRefundModal: (record: IOnlineOrdersCSManagement) => {
    set(() => ({ record, isOpenRefundModal: true }));
  },
  closeRefundModal: () => {
    set(() => ({ record: null, isOpenRefundModal: false }));
  },
  isOpenCancelModal: false,
  openCancelModal: (record: IOnlineOrdersCSManagement) => {
    set(() => ({ record, isOpenCancelModal: true }));
  },
  closeCancelModal: () => {
    set(() => ({ record: null, isOpenCancelModal: false }));
  },
  isOpenSendQrESIM: false,
  openSendQrESIMModal: (record: IOnlineOrdersCSManagement) => {
    set(() => ({ record, isOpenSendQrESIM: true }));
  },
  closeSendQrESIMModal: () => {
    set(() => ({ record: null, isOpenSendQrESIM: false }));
  },
}));
export default useOrderCSStore;
