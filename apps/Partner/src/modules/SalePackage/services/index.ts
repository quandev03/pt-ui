import { AnyElement, IPage } from '@vissoft-react/common';
import { prefixSaleService } from '../../../../src/constants';
import { axiosClient, safeApiClient } from '../../../../src/services';
import {
  IPackage,
  IPackageSaleItem,
  IPackageSaleParams,
  IPayloadGenOtp,
  IPayloadRegister,
  ISaleParamsResponse,
  ISinglePackageSalePayload,
} from '../types';
export const packageSaleService = {
  getPackageSales: (params: IPackageSaleParams) => {
    return safeApiClient.get<IPage<IPackageSaleItem>>(
      `${prefixSaleService}/sale-package/batch-sales`,
      {
        params,
      }
    );
  },
  addPackageSingle: async (data: ISinglePackageSalePayload) => {
    const res = await safeApiClient.post<ISinglePackageSalePayload>(
      `${prefixSaleService}/sale-package/register-package`,
      data
    );
    return res;
  },

  checkDataFile: async (file: File) => {
    const formData = new FormData();
    formData.append('attachment', file);
    const res = await axiosClient.post<Blob>(
      `${prefixSaleService}/sale-package/check-data`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      }
    );
    return res.data;
  },

  genOtp: async (data: IPayloadGenOtp) => {
    const res = await safeApiClient.post<IPayloadRegister>(
      `${prefixSaleService}/sale-package/register-package`,
      data
    );
    return res;
  },
  getPackageCodes: async () => {
    const res = await safeApiClient.get<IPackage[]>(
      `${prefixSaleService}/esim-free/get-package`
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  getRegisterPackage: async (payload: ISinglePackageSalePayload) => {
    const res = await safeApiClient.post<AnyElement>(
      `${prefixSaleService}/sale-package/register-package`,
      payload
    );
    if (!res) throw new Error('Oops');
    return res;
  },
  getSaleParams: async (): Promise<ISaleParamsResponse> => {
    const response = await safeApiClient.get<ISaleParamsResponse>(
      `${prefixSaleService}/params`
    );
    return response;
  },
};
