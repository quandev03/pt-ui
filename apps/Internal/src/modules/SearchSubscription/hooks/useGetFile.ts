import { useMutation } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (url: string) => {
  return axiosClient.get<any, Blob>(`${prefixCustomerService}/file${url}`, {
    responseType: 'blob',
  });
};
export const useGetFile = (form: FormInstance) => {
  return useMutation({
    mutationFn: fetcher,
  });
};
