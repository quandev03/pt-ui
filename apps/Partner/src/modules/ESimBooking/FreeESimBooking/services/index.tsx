import { IPage, IParamsRequest } from '@vissoft-react/common';
import { IBookFreeEsim, IFreeEsimBooking } from '../types';
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
  getBookEsimFree: async (data: IBookFreeEsim) => {
    const { ...payload } = data;
    const createNewEsimRes = await safeApiClient.post<IBookFreeEsim>(
      `${prefixSaleService}/esim-free/book`,
      payload
    );
    return createNewEsimRes;
  },

  //   createUser: async (data: IFormUser) => {
  //   const { organizationIds, ...payload } = data;
  //   const createUserRes = await safeApiClient.post<IUserItem>(
  //     `${prefixAuthService}/api/users/internal`,
  //     payload
  //   );
  //   return createUserRes;
  // },
};
