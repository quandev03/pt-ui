import { create } from 'zustand';
import {
  IDetailOnlineOrder,
  IOnlineOrdersManagement,
  paramsDefault,
  ParamsOnlineOrdersManagement,
} from '../types';

export interface IUserStore {
  params: ParamsOnlineOrdersManagement;
  idDetail: string | number;
  isValuesChanged: boolean;
  onlineOrderDetail: IDetailOnlineOrder;
  provinceSelected: string;
  districtSelected: string;
  isOpenSendQrESIM: boolean;
  closeSendQrESIMModal: () => void;
  openSendQrESIMModal: (record: IDetailOnlineOrder) => void;
  setParamSearch: (mode: ParamsOnlineOrdersManagement) => void;
  setIdDetail: (mode: string | number) => void;
  setIsValuesChanged: (isChanged: boolean) => void;
  setOnlineOrderDetail: (item: IDetailOnlineOrder) => void;
  resetOnlineOrder: () => void;
  setProvinceSelected: (provinceSelected: string) => void;
  setDistrictSelected: (districtSelected: string) => void;
}

const useStore = create<IUserStore>((set) => ({
  params: paramsDefault,
  idDetail: '',
  isValuesChanged: false,
  onlineOrderDetail: {} as IDetailOnlineOrder,
  provinceSelected: '',
  districtSelected: '',
  isOpenSendQrESIM: false,
  setParamSearch(mode) {
    set(() => ({ params: mode }));
  },
  setIdDetail(mode) {
    set(() => ({ idDetail: mode }));
  },
  setIsValuesChanged(mode) {
    set(() => ({ isValuesChanged: mode }));
  },
  setOnlineOrderDetail(item) {
    set(() => ({ onlineOrderDetail: item }));
  },
  openSendQrESIMModal: (record: IDetailOnlineOrder) => {
    set((state) => ({
      ...state,
      onlineOrderDetail: record as IDetailOnlineOrder,
      isOpenSendQrESIM: true,
    }));
  },
  resetOnlineOrder() {
    set(() => ({
      onlineOrderDetail: {} as IDetailOnlineOrder,
      isValuesChanged: false,
    }));
  },
  setProvinceSelected(provinceSelected) {
    set(() => ({ provinceSelected }));
  },
  setDistrictSelected(districtSelected) {
    set(() => ({ districtSelected }));
  },
  closeSendQrESIMModal: () => {
    set(() => ({ record: null, isOpenSendQrESIM: false }));
  },
}));
export default useStore;
