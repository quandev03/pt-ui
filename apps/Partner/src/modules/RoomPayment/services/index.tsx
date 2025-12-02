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
    return safeApiClient.get<IRoomPayment[]>(
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
    
    // Gửi month và year dưới dạng JSON với Content-Type application/json
    formData.append('month', new Blob([JSON.stringify(data.month)], { type: 'application/json' }));
    formData.append('year', new Blob([JSON.stringify(data.year)], { type: 'application/json' }));

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

  resendEmail: async (id: string) => {
    return await safeApiClient.post(
      `${prefixSaleService}/room-payments/${id}/resend-email`
    );
  },
};

