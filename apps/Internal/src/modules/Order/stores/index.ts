import { create } from 'zustand';
import {
  ActionType,
  ICalculateDiscountData,
  IDataOrder,
  IOrder,
  IProductInOrder,
} from '../types';

export enum TypeCraftEnum {
  BY_ORDER = 'BY_ORDER',
  NON_BY_ORDER = 'NON_BY_ORDER',
}

export interface IOrderStore {
  calculateInfo: ICalculateDiscountData | null;
  productInfos: IProductInOrder[];
  setCalculateInfo: (calculateInfo: ICalculateDiscountData) => void;
  resetOrderStore: () => void;
  orderDetail?: IDataOrder;
  typeAction: ActionType;
  setTypeAction: (actionType: ActionType) => void;
  setOrderDetail: (orderDetail?: IDataOrder) => void;
  setShowValidProduct: (showValidProduct: boolean) => void;
  showValidProduct: boolean;
  productSelected: IProductInOrder[];
  setProductSelected: (productSelected: IProductInOrder[]) => void;
  addProductSelected: (productSelected: IProductInOrder) => void;
  removeProductSelected: (index: number) => void;
  updateProductByIndex: (
    index: number,
    productSelected: IProductInOrder
  ) => void;

  provinceSelected: string;
  districtSelected: string;
  setProvinceSelected: (provinceSelected: string) => void;
  setDistrictSelected: (districtSelected: string) => void;
}

const useOrderStore = create<IOrderStore>((set) => ({
  productListInCategory: [],
  calculateInfo: null,
  productSelected: [],
  productInfos: [],
  showValidProduct: false,
  provinceSelected: '',
  districtSelected: '',
  typeAction: '',
  setTypeAction(typeAction) {
    set(() => ({ typeAction }));
  },
  setOrderDetail(orderDetail) {
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
  setProductSelected(payload) {
    set(() => ({
      productSelected: payload,
    }));
  },
  addProductSelected(payload) {
    set(({ productSelected }) => ({
      productSelected: [...productSelected, payload],
    }));
  },
  removeProductSelected(index) {
    set(({ productSelected }) => ({
      productSelected: productSelected.filter((item, idx) => idx !== index),
    }));
  },
  updateProductByIndex(index, payload) {
    set(({ productSelected }) => ({
      productSelected: productSelected.map((item, idx) => {
        if (idx === index) {
          return payload;
        }
        return item;
      }),
    }));
  },
  setCalculateInfo(calculateInfo) {
    set(() => ({ calculateInfo }));
  },

  resetOrderStore() {
    set(() => ({
      calculateInfo: null,
      productSelected: [],
      productInfos: [],
      showValidProduct: false,
      providerSelected: '',
      districtSelected: '',
    }));
  },
}));
export default useOrderStore;
