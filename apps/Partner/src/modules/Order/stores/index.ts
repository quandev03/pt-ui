import { create } from 'zustand';
import { ICalculateDiscountData, IDataOrder, IProductInOrder } from '../types';

export enum TypeCraftEnum {
  BY_ORDER = 'BY_ORDER',
  NON_BY_ORDER = 'NON_BY_ORDER',
}

export interface IOrderStore {
  calculateInfo: ICalculateDiscountData | null;
  productInfos: IProductInOrder[];
  orderDetail?: IDataOrder;
  setOrder: (orderDetail: IDataOrder) => void;
  setCalculateInfo: (calculateInfo: ICalculateDiscountData | null) => void;
  resetOrderStore: () => void;

  setShowValidProduct: (showValidProduct: boolean) => void;
  showValidProduct: boolean;
  showValidDiscount: boolean;
  setShowValidDiscount: (showValidDiscount: boolean) => void;
  districtSelected: string;
  provinceSelected: string;
  setProvinceSelected: (provinceSelected: string) => void;
  setDistrictSelected: (districtSelected: string) => void;
}

const useOrderStore = create<IOrderStore>((set) => ({
  calculateInfo: null,

  productInfos: [],
  showValidProduct: false,
  showValidDiscount: false,
  provinceSelected: '',
  districtSelected: '',
  setOrder(orderDetail) {
    set(() => ({ orderDetail }));
  },
  setProvinceSelected(provinceSelected) {
    set(() => ({ provinceSelected }));
  },
  setDistrictSelected(districtSelected) {
    set(() => ({ districtSelected }));
  },
  setShowValidProduct(showValidProduct) {
    set(() => ({ showValidProduct }));
  },
  setShowValidDiscount(showValidDiscount) {
    set(() => ({ showValidDiscount }));
  },

  setCalculateInfo(calculateInfo) {
    set(() => ({ calculateInfo }));
  },

  resetOrderStore() {
    set(() => ({
      calculateInfo: null,

      productInfos: [],
      showValidProduct: false,
      showValidDiscount: false,
      orderDetail: undefined,
      errorIndex: [],
    }));
  },
}));
export default useOrderStore;
