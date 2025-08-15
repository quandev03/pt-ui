import { AnyElement, IPage, IParamsRequest } from '@vissoft-react/common';
import { IBookFreeEsimPayload, IFreeEsimBooking, IPackage } from '../types';
import { prefixSaleService } from '../../../../constants';
import { safeApiClient } from '../../../../services/axios';

export const freeEsimBookingServices = {
  getListFreeEsimBooking: async (params: IParamsRequest) => {
    return safeApiClient.get<IPage<IFreeEsimBooking>>(
      `${prefixSaleService}/esim-free/book-free`,
      {
        params,
      }
    );
  },
  getBookEsimFree: async (data: IBookFreeEsimPayload) => {
    const createNewEsimRes = await safeApiClient.post<AnyElement>(
      `${prefixSaleService}/esim-free/book`,
      data
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
