import { prefixSaleService, baseApiUrl } from '../../../../src/constants';
import { safeApiClient } from '../../../../src/services';
import { IAgency, IAgencyParams, IFormAgency } from '../types';

// Function để build URL download ảnh
export const getImageDownloadUrl = (fileUrl: string): string => {
  if (!fileUrl) return '';
  // Encode fileUrl để tránh lỗi với các ký tự đặc biệt
  const encodedFileUrl = encodeURIComponent(fileUrl);
  return `${baseApiUrl}/${prefixSaleService}/files/download?fileUrl=${encodedFileUrl}`;
};

export const agencyListService = {
  getAgencies: (params: IAgencyParams) => {
    return safeApiClient.get<IAgency[]>(
      `${prefixSaleService}/organization-unit`,
      {
        params,
      }
    );
  },
  getAgency: async (id: string) => {
    const res = await safeApiClient.get<IAgency>(
      `${prefixSaleService}/organization-unit/${id}`
    );
    return res;
  },
  createAgency: async (data: IFormAgency) => {
    // Bỏ ảnh ra, chỉ gửi form data
    const { images, ...formData } = data;
    
    const createAgencyRes = await safeApiClient.post<IAgency>(
      `${prefixSaleService}/organization-unit`,
      formData
    );
    return createAgencyRes;
  },
  updateAgency: async (data: IFormAgency) => {
    // Bỏ ảnh ra, chỉ gửi form data
    const { images, ...formData } = data;
    
    const res = await safeApiClient.put<IAgency>(
      `${prefixSaleService}/organization-unit/${data.id}`,
      formData
    );
    return res;
  },
  uploadAgencyImages: async (orgUnitId: string, files: File[]) => {
    const formData = new FormData();
    // Thêm từng ảnh vào FormData với key là "files"
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    const res = await safeApiClient.post(
      `${prefixSaleService}/organization-unit/${orgUnitId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res;
  },
  deleteAgencys: async (id: string) => {
    const res = await safeApiClient.delete(
      `${prefixSaleService}/organization-unit/${id}`
    );
    return res;
  },
};
