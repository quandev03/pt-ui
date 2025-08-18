import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants';
import {
  apiUtils,
  axiosClient,
  safeRequestWithResponse,
} from 'apps/Internal/src/services/axios';
import { IParameter } from '../types';

const fetch = async (params: IParameter) => {
  try {
    const res = await safeRequestWithResponse<Blob>(
      axiosClient.post<Blob>(
        `${prefixSaleService}/subscriber/export-excel`,
        {},
        {
          params,
          responseType: 'blob',
        }
      )
    );
    return res;
  } catch (error) {
    throw error;
  }
};
export const useExport = () => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: (response) => {
      apiUtils.handleDownloadResponse(response, 'danh_sach.csv');
    },
  });
};
