import { IPage } from '@vissoft-react/common';
import { safeApiClient } from '../../../../src/services';
import {
  ICustomerInfo,
  IEsimWarehouseDetails,
  IEsimWarehouseList,
  IEsimWarehouseParams,
  IGetPackageCodes,
  IQrCodeGen,
  IQrCodeSent,
} from '../types';
import { prefixSaleService } from '../../../../src/constants';

export const esimWarehouseServices = {
  getEsimWarehouseList: (params: IEsimWarehouseParams) => {
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

  getExportReport: async (params: IEsimWarehouseParams) => {
    const apiParams = {
      textSearch: params.textSearch,
      activeStatus: params.activeStatus,
      pckCode: params.pckCode,
      subStatus: params.subStatus,
      orgId: params.orgId,
    };

    const res = await safeApiClient.post<Blob>(
      `${prefixSaleService}/esim-manager/export`,
      null,
      {
        params: apiParams,
        responseType: 'blob',
      }
    );
    if (!res || !res || res.size === 0) {
      throw new Error(
        'Không có dữ liệu để xuất báo cáo. Vui lòng kiểm tra lại bộ lọc.'
      );
    }
    return res;
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
    console.log('🚀 ~ ressssssssssssss:', res);

    // if (res instanceof Blob && res.type === 'application/problem+json') {
    //   // Convert Blob to JSON
    //   const text = await res.text();
    //   const jsonError: IErrorResponse = JSON.parse(text);
    //   console.log('🚀 ~ jsonError:', jsonError);
    //   throw jsonError; // Throw the parsed JSON error
    // }
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
