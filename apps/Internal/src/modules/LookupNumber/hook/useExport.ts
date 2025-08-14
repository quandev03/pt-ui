import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services/axios';
import { IParameter } from '../types';
import { downloadFileExcel } from '@vissoft-react/common';

const fetch = async (params: IParameter) => {
  try {
    const res = await safeApiClient.post<Blob>(
      `${prefixSaleService}/subscriber/export-excel`,
      params,
      {
        responseType: 'blob',
      }
    );
    return res;
  } catch (error) {
    throw error;
  }
};
export const useExport = () => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      downloadFileExcel(data, 'danh_sach.xlsx');
    },
  });
};
