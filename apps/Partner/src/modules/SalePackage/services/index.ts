import { AnyElement, IPage } from '@vissoft-react/common';
import {
  prefixAuthService,
  prefixSaleService,
} from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import {
  IBulkPackageSalePayload,
  IPackage,
  IPackageSaleItem,
  IPackageSaleParams,
  IPayloadCheckIsdnAndGetPackage,
  IPayloadGenOtp,
  IPayloadRegister,
  IResGenOtp,
} from '../types';
export const packageSaleService = {
  getPackageSales: (params: IPackageSaleParams) => {
    return safeApiClient.get<IPage<IPackageSaleItem>>(
      `${prefixAuthService}/api/package-sale`,
      {
        params,
      }
    );
  },
  createSinglePackageSale: async (data: IPayloadRegister) => {
    const createAgencyRes = await safeApiClient.post<AnyElement>(
      `${prefixAuthService}/api/package-sale`,
      data
    );
    return createAgencyRes;
  },
  createBulkPackageSale: async (data: IBulkPackageSalePayload) => {
    const createAgencyRes = await safeApiClient.post<AnyElement>(
      `${prefixAuthService}/api/package-sale`,
      data
    );
    return createAgencyRes;
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
  genOtp: async (data: IPayloadGenOtp) => {
    const res = await safeApiClient.post<IResGenOtp>(
      `${prefixSaleService}/sale-package/gen-otp`,
      data
    );
    return res;
  },
};
