import { IPage } from '@vissoft-react/common';
import { prefixSaleService } from '../../../constants';
import { safeApiClient } from '../../../services/axios';
import {
  ICustomerInfo,
  IeSIMStockDetail,
  IeSIMStockItem,
  IeSIMStockParams,
  IPackage,
} from '../types';

export const eSIMStockServices = {
  geteSIMStock: (params: IeSIMStockParams) => {
    return safeApiClient.get<IPage<IeSIMStockItem>>(
      `${prefixSaleService}/esim-manager`,
      {
        params,
      }
    );
  },
  getDetaileSIMStock: async (id: string) => {
    return await safeApiClient.get<IeSIMStockDetail[]>(
      `${prefixSaleService}/esim-manager/${id}`
    );
  },
  getPackage: async () => {
    return await safeApiClient.get<IPackage[]>(
      `${prefixSaleService}/esim-manager/package`
    );
  },
  getCustomerInfo: async (id: string) => {
    return await safeApiClient.get<ICustomerInfo>(
      `${prefixSaleService}/esim-manager/detail/${id}`
    );
  },
};
