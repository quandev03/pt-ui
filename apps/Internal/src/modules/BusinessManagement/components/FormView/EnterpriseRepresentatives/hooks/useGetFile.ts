import { useMutation } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import useRepresentativeStore from '../store';

const fetcher = (url: string) => {
  return axiosClient.get<any, Blob>(`${prefixCustomerService}/file${url}`, {
    responseType: 'blob',
  });
};
export const useGetFile = (form: FormInstance) => {
  const { authorizedFileName } = useRepresentativeStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess(data) {
      const attachFile = new File([data], authorizedFileName, {
        type: data.type,
      });
      form.setFieldValue('authorizedFile', attachFile);
    },
  });
};
