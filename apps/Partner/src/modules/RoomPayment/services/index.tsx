import { IPage } from '@vissoft-react/common';
import { prefixSaleService } from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import type { AxiosRequestHeaders } from 'axios';
import {
  IRoomPayment,
  IRoomPaymentParams,
  IRoomPaymentUploadParams,
} from '../types';

export const roomPaymentServices = {
  getRoomPaymentList: (params: IRoomPaymentParams) => {
    return safeApiClient.get<IPage<IRoomPayment>>(
      `${prefixSaleService}/room-payments`,
      {
        params,
      }
    );
  },

  getRoomPaymentDetail: async (id: string) => {
    return await safeApiClient.get<IRoomPayment>(
      `${prefixSaleService}/room-payments/${id}`
    );
  },

  uploadRoomPaymentFile: async (data: IRoomPaymentUploadParams) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('month', data.month.toString());
    formData.append('year', data.year.toString());

    return await safeApiClient.post<IRoomPayment[]>(
      `${prefixSaleService}/room-payments/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        } as AxiosRequestHeaders,
      }
    );
  },
};

