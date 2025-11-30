import { prefixSaleService, baseApiUrl } from '../../../../src/constants';
import { axiosClient, safeApiClient } from '../../../../src/services';
import type { AxiosRequestHeaders } from 'axios';
import { IPage } from '@vissoft-react/common';
import {
  IContract,
  IContractParams,
  IOCRParams,
  IOCRResponse,
  IGenContractParams,
  IContractForm,
  ISaveContractParams,
} from '../types';

export const contractManagementServices = {
  getContractList: (params: IContractParams) => {
    return safeApiClient.get<IPage<IContract>>(
      `${prefixSaleService}/contracts-management/contracts`,
      {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          ...(params.ownerName && { ownerName: params.ownerName }),
          ...(params.tenantName && { tenantName: params.tenantName }),
          ...(params.fromDate && { fromDate: params.fromDate }),
          ...(params.toDate && { toDate: params.toDate }),
          ...(params.sort && { sort: params.sort }),
          ...(params.roomId && { roomId: params.roomId }),
          ...(params.textSearch && { textSearch: params.textSearch }),
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
        },
      }
    );
  },

  getContractDetail: async (id: string) => {
    return await safeApiClient.get<IContract>(
      `${prefixSaleService}/contracts-management/contracts/${id}`
    );
  },

  getDownloadUrl: (filePath: string): string => {
    // Tạo download URL từ filePath
    // API download có format: /contracts-management/files/download?fileUrl=...
    if (!filePath) return '';
    const downloadUrl = `${baseApiUrl}/${prefixSaleService}/files/download?fileUrl=${encodeURIComponent(filePath)}`;
    return downloadUrl;
  },

  downloadFileAsBlob: async (filePath: string): Promise<Blob> => {
    // Download file và trả về Blob để hiển thị trong iframe
    if (!filePath) {
      throw new Error('File path is required');
    }
    const downloadUrl = `${baseApiUrl}/${prefixSaleService}/files/download?fileUrl=${encodeURIComponent(filePath)}`;
    
    const response = await axiosClient.get<Blob>(downloadUrl, {
      responseType: 'blob',
      headers: {
        'Content-Type': undefined,
      } as any,
    });

    let blob: Blob;
    if (response instanceof Blob) {
      blob = response;
    } else {
      const data = (response as any)?.data;
      if (data instanceof Blob) {
        blob = data;
      } else if (data instanceof ArrayBuffer) {
        blob = new Blob([data], { type: 'application/pdf' });
      } else {
        blob = new Blob([data || response], { type: 'application/pdf' });
      }
    }

    // Đảm bảo type là PDF
    if (!blob.type || blob.type === 'application/octet-stream') {
      blob = new Blob([blob], { type: 'application/pdf' });
    }

    return blob;
  },

  ocrData: async (params: IOCRParams) => {
    const formData = new FormData();
    formData.append('front', params.front);
    formData.append('back', params.back);
    formData.append('portrait', params.portrait);

    // Khi gửi FormData, axios sẽ tự động set Content-Type với boundary
    const response = await axiosClient.post<IOCRResponse>(
      `${prefixSaleService}/contracts-management/ocr-data?typeCard=${params.typeCard || 1}`,
      formData,
      {
        headers: {
          // Xóa Content-Type để axios tự động set với boundary cho FormData
          'Content-Type': undefined,
        } as any,
      }
    );
    // axiosClient interceptor returns response.data, but ensure we have the data
    return response?.data || response;
  },

  genContract: async (params: IGenContractParams) => {
    const formData = new FormData();
    
    // Append request JSON với Content-Type application/json
    const requestData = {
      organizationUnitId: params.organizationUnitId,
      contractData: params.contractData,
    };
    const requestBlob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
    formData.append('request', requestBlob);
    
    // Append images - để FormData tự động set Content-Type (image/jpeg, image/png, etc.)
    // API gen-contract không chấp nhận application/octet-stream cho file ảnh
    formData.append('frontImage', params.frontImage);
    formData.append('backImage', params.backImage);
    formData.append('portraitImage', params.portraitImage);

    // Khi gửi FormData, axios sẽ tự động set Content-Type với boundary
    const response = await axiosClient.post<Blob>(
      `${prefixSaleService}/contracts-management/gen-contract`,
      formData,
      {
        headers: {
          // Xóa Content-Type để axios tự động set với boundary cho FormData
        },
        transformRequest: [
          (data, headers) => {
            // Nếu là FormData, xóa Content-Type header để axios tự động set
            if (data instanceof FormData) {
              delete headers['Content-Type'];
            }
            return data;
          },
        ],
        responseType: 'blob',
      }
    );
    
    // axiosClient interceptor trả về response.data, nhưng với blob responseType, 
    // response có thể là object {data: Blob, ...} hoặc trực tiếp là Blob
    let blob: Blob;
    
    // Kiểm tra xem response có phải là Blob không
    if (response instanceof Blob) {
      blob = response;
    } else {
      // Nếu không, lấy từ response.data
      const data = (response as any)?.data;
      if (data instanceof Blob) {
        blob = data;
      } else if (data instanceof ArrayBuffer) {
        // Mặc định là PDF nếu không có type
        blob = new Blob([data], { type: 'application/pdf' });
      } else {
        // Fallback: convert sang Blob, mặc định là PDF
        blob = new Blob([data || response], { type: 'application/pdf' });
      }
    }
    
    // Nếu blob không có type hoặc type không đúng, giữ nguyên hoặc set mặc định là PDF
    if (!blob.type || blob.type === 'application/octet-stream') {
      // Kiểm tra response headers nếu có để xác định type
      const contentType = (response as any)?.headers?.['content-type'] || 
                         (response as any)?.headers?.['Content-Type'];
      const finalType = contentType || 'application/pdf';
      blob = new Blob([blob], { type: finalType });
    }
    
    return blob;
  },

  saveContract: async (params: ISaveContractParams) => {
    // Log để debug - kiểm tra params có đến được service không
    console.log('=== saveContract service - Input params ===');
    console.log('organizationUnitId:', params.organizationUnitId);
    console.log('frontImage:', {
      exists: !!params.frontImage,
      isFile: params.frontImage instanceof File,
      name: params.frontImage?.name,
      size: params.frontImage?.size,
      type: params.frontImage?.type,
    });
    console.log('backImage:', {
      exists: !!params.backImage,
      isFile: params.backImage instanceof File,
      name: params.backImage?.name,
      size: params.backImage?.size,
      type: params.backImage?.type,
    });
    console.log('portraitImage:', {
      exists: !!params.portraitImage,
      isFile: params.portraitImage instanceof File,
      name: params.portraitImage?.name,
      size: params.portraitImage?.size,
      type: params.portraitImage?.type,
    });

    const formData = new FormData();
    
    // Append request JSON với Content-Type application/json - giống hệt genContract
    const requestData = {
      organizationUnitId: params.organizationUnitId,
      contractData: params.contractData,
    };
    const requestBlob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
    formData.append('request', requestBlob);
    
    // Append images - để FormData tự động set Content-Type (image/jpeg, image/png, etc.)
    // Giống hệt genContract
    formData.append('frontImage', params.frontImage);
    formData.append('backImage', params.backImage);
    formData.append('portraitImage', params.portraitImage);

    // Debug: Log FormData entries
    console.log('=== FormData entries ===');
    try {
      const entries = (formData as any).entries ? (formData as any).entries() : [];
      for (const [key, value] of entries) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else if (value instanceof Blob) {
          console.log(`${key}: Blob(${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }
    } catch (e) {
      console.log('Cannot iterate FormData entries');
    }
    console.log('========================');

    // Khi gửi FormData, axios sẽ tự động set Content-Type với boundary - giống hệt genContract
    // Cần xóa Content-Type header mặc định để axios tự động set với boundary
    return await axiosClient.post<IContract>(
      `${prefixSaleService}/contracts-management/contracts`,
      formData,
      {
        headers: {
          // Xóa Content-Type để axios tự động set với boundary cho FormData
          // Sử dụng delete thay vì undefined để đảm bảo header bị xóa hoàn toàn
        },
        transformRequest: [
          (data, headers) => {
            // Nếu là FormData, xóa Content-Type header để axios tự động set
            if (data instanceof FormData) {
              delete headers['Content-Type'];
            }
            return data;
          },
        ],
      }
    );
  },
};

