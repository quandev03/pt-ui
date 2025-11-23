import { prefixSaleService } from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import type { AxiosRequestHeaders } from 'axios';
import {
  IAdvertisement,
  IAdvertisementParams,
  IFormAdvertisement,
  IAdvertisementCreateRequest,
} from '../types';

export const advertisementServices = {
  getAdvertisementList: (params?: IAdvertisementParams) => {
    return safeApiClient.get<IAdvertisement[]>(
      `${prefixSaleService}/advertisements`,
      {
        params,
      }
    );
  },

  getAdvertisementDetail: async (id: string) => {
    return await safeApiClient.get<IAdvertisement>(
      `${prefixSaleService}/advertisements/${id}`
    );
  },

  createAdvertisement: async (
    data: IAdvertisementCreateRequest,
    imageFile?: File | null
  ) => {
    const formData = new FormData();
    
    // Append request as JSON string
    formData.append(
      'request',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return await safeApiClient.post<IAdvertisement>(
      `${prefixSaleService}/advertisements`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        } as AxiosRequestHeaders,
      }
    );
  },

  updateAdvertisement: async (
    id: string,
    data: IAdvertisementCreateRequest,
    imageFile?: File | null
  ) => {
    const formData = new FormData();
    
    // Append request as JSON string
    formData.append(
      'request',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    // Append image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return await safeApiClient.put<IAdvertisement>(
      `${prefixSaleService}/advertisements/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        } as AxiosRequestHeaders,
      }
    );
  },

  deleteAdvertisement: async (id: string) => {
    return await safeApiClient.delete<{ message: string }>(
      `${prefixSaleService}/advertisements/${id}`
    );
  },
};

