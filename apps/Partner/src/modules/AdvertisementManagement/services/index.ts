import { prefixSaleService, baseApiUrl } from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import type { AxiosRequestHeaders } from 'axios';
import {
  IAdvertisement,
  IAdvertisementParams,
  IFormAdvertisement,
  IAdvertisementCreateRequest,
} from '../types';

// Function để build URL download ảnh
export const getImageDownloadUrl = (fileUrl: string): string => {
  if (!fileUrl) return '';
  // Encode fileUrl để tránh lỗi với các ký tự đặc biệt
  const encodedFileUrl = encodeURIComponent(fileUrl);
  return `${baseApiUrl}/${prefixSaleService}/files/download?fileUrl=${encodedFileUrl}`;
};

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
    
    // Append request as JSON string with Content-Type application/json
    const requestBlob = new Blob([JSON.stringify(data)], { 
      type: 'application/json' 
    });
    formData.append('request', requestBlob, 'request.json');

    // Append image file if provided
    if (imageFile && imageFile instanceof File) {
      formData.append('image', imageFile, imageFile.name);
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
    
    // Append request as JSON string with Content-Type application/json
    const requestBlob = new Blob([JSON.stringify(data)], { 
      type: 'application/json' 
    });
    formData.append('request', requestBlob, 'request.json');

    // Append image file if provided
    if (imageFile && imageFile instanceof File) {
      formData.append('image', imageFile, imageFile.name);
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

