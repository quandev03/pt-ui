import { IPage } from '@vissoft-react/common';
import { prefixSaleService } from '../../../../src/constants';
import { axiosClient, safeApiClient } from '../../../../src/services';
import {
  IPackage,
  IPackageSaleItem,
  IPackageSaleParams,
  IPayloadCheckIsdnAndGetPackage,
  IPayloadGenOtp,
  IPayloadRegister,
  IResGenOtp,
} from '../types';
import { RcFile } from 'antd/lib/upload';
export const packageSaleService = {
  getPackageSales: (params: IPackageSaleParams) => {
    return safeApiClient.get<IPage<IPackageSaleItem>>(
      `${prefixSaleService}/sale-package/batch-sales`,
      {
        params,
      }
    );
  },
  addPackageSingle: async (data: IPayloadRegister) => {
    const res = await safeApiClient.post<IPayloadRegister>(
      `${prefixSaleService}/sale-package/register-package`,
      data
    );
    return res;
  },
  checkIsdnAndGetPackage: async (payload: IPayloadCheckIsdnAndGetPackage) => {
    const res = await safeApiClient.get<IPackage[]>(
      `${prefixSaleService}/sale-package/check-isdn`,
      {
        params: payload,
      }
    );
    return res;
  },
  checkDataFile: async (file: RcFile) => {
    const formData = new FormData();
    formData.append('attachment', file);
    const res = await axiosClient.post<string, Blob>(
      `${prefixSaleService}/sale-package/check-data`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      }
    );
    return res;
  },
  genOtp: async (data: IPayloadGenOtp) => {
    const res = await safeApiClient.post<IResGenOtp>(
      `${prefixSaleService}/sale-package/gen-otp`,
      data
    );
    return res;
  },
};
