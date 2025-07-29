import { create } from 'zustand';
import { IDetail, paramsDefault, ParamsDiscountManagement } from '../types';

export interface IUserStore {
  params: ParamsDiscountManagement;
  idDetail: string | number;
  isValuesChanged: boolean;
  discountDetail: IDetail;

  setParamSearch: (mode: ParamsDiscountManagement) => void;
  setIdDetail: (mode: string | number) => void;
  setIsValuesChanged: (isChanged: boolean) => void;
  setDiscountDetail: (item: IDetail) => void;
  resetDiscount: () => void;
}

const useStore = create<IUserStore>((set) => ({
  params: paramsDefault,
  idDetail: '',
  isValuesChanged: false,
  discountDetail: {} as IDetail,

  setParamSearch(mode) {
    set(() => ({ params: mode }));
  },
  setIdDetail(mode) {
    set(() => ({ idDetail: mode }));
  },
  setIsValuesChanged(mode) {
    set(() => ({ isValuesChanged: mode }));
  },
  setDiscountDetail(item) {
    set(() => ({ discountDetail: item }));
  },
  resetDiscount() {
    set(() => ({
      discountDetail: {} as IDetail,
      isValuesChanged: false,
    }));
  },
}));
export default useStore;
