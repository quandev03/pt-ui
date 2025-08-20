import { IPage, IParamsRequest } from '@vissoft-react/common';
import { safeApiClient } from '../../../../src/services';
import {
  ICustomerInfo,
  IEsimWarehouseDetails,
  IEsimWarehouseList,
  IGetPackageCodes,
  IQrCodeGen,
  IQrCodeSent,
} from '../types';
import { prefixSaleService } from '../../../../src/constants';

export const esimWarehouseServices = {
  getEsimWarehouseList: (params: IParamsRequest) => {
    return safeApiClient.get<IPage<IEsimWarehouseList>>(
      `${prefixSaleService}/esim-manager`,
      {
        params,
      }
    );
  },

  getDetailEsimWarehouse: async (subId?: string) => {
    return await safeApiClient.get<IEsimWarehouseDetails[]>(
      `${prefixSaleService}/esim-manager/${subId}`
    );
  },

  getCustomerInfo: async (subId?: string) => {
    return await safeApiClient.get<ICustomerInfo>(
      `${prefixSaleService}/esim-manager/detail/${subId}`
    );
  },

  getGenQrCode: async (params: IQrCodeGen) => {
    const { subId, size } = params;
    const res = await safeApiClient.post<Blob>(
      `${prefixSaleService}/esim-manager/gen-qr-code/${subId}`,
      null,
      {
        params: {
          size: size,
        },
        responseType: 'blob',
      }
    );
    return res;
  },
  getSendQrCode: async (data: IQrCodeSent) => {
    const { ...payload } = data;
    const createNewEsimRes = await safeApiClient.post<IQrCodeSent>(
      `${prefixSaleService}/esim-manager/sent-qr-code`,
      payload
    );
    return createNewEsimRes;
  },

  getPackageCodes: async () => {
    const res = await safeApiClient.get<IGetPackageCodes>(
      `${prefixSaleService}/esim-manager/package`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
};
