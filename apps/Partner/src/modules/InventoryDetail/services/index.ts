import { axiosClient } from 'apps/Partner/src/service';
import {
  IInventoryDetail,
  IOrgUser,
  ParamsInventoryDetail,
  Req,
} from '../types';
import { prefixSaleService } from '@react/url/app';

interface Res {
  content: IInventoryDetail[];
  totalElements: number;
  size: number;
}

export const Inventory = {
  exportSerial: async (param: ParamsInventoryDetail) => {
    const res = await axiosClient.get<any, Blob>(
      `${prefixSaleService}/stock-product/export-report/${param.inventoryCode}`,
      {
        params: {
          ...param,
        },
        responseType: 'blob',
      }
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  exportInventory: async (param: ParamsInventoryDetail) => {
    const res = await axiosClient.get<any, Blob>(
      `${prefixSaleService}/stock-product/export-report/${param.inventoryCode}`,
      {
        params: {
          ...param,
        },
        responseType: 'blob',
      }
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  getInventoryList: async (param: ParamsInventoryDetail) => {
    const res = await axiosClient.get<Req, Res>(
      `${prefixSaleService}/stock-product/${param.inventoryCode}`,
      {
        params: {
          ...param,
          inventoryCode: undefined,
        },
      }
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  getListOrgUser: async () => {
    const res = await axiosClient.get<any, IOrgUser[]>(
      `${prefixSaleService}/organization-user/search-all-children-authoried-organization`
    );
    if (!res) throw new Error('Opps');
    return res;
  },
};
