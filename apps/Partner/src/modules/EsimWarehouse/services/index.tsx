import { IPage, IParamsRequest } from '@vissoft-react/common';
import { safeApiClient } from '../../../../src/services';
import {
  IEsimWarehouseDetails,
  IEsimWarehouseList,
  IPackage,
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

  getDetailEsimWarehouse: async ({ subId }: { subId?: string }) => {
    return await safeApiClient.get<IEsimWarehouseDetails>(
      `${prefixSaleService}/esim-manager/${subId}`
    );
  },

  getGenQrCode: async (params: IQrCodeGen): Promise<Blob> => {
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
    const res = await safeApiClient.get<IPackage[]>(
      `${prefixSaleService}/esim-free/get-package`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
};
