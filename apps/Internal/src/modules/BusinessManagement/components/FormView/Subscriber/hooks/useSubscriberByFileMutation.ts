import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from '@react/url/app';
import { CommonError } from '@react/commons/types';
import { mapApiErrorToForm } from '@react/helpers/utils';
import { FormInstance } from 'antd';
import { SubscriberByFileRequest } from '../types';

const fetcher = (params: SubscriberByFileRequest) => {
  const formData = new FormData();
  const metaData = JSON.stringify(params.metaData);
  formData.append('metaData', metaData);
  formData.append('file', params.file);

  return axiosClient.post<SubscriberByFileRequest, Response>(
    `${prefixCustomerService}/lock-unlock-by-file`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const useSubscriberByFileMutation = (form: FormInstance) => {
  return useMutation({
    mutationFn: fetcher,
    onError: (error: CommonError) => mapApiErrorToForm(form, error.errors),
  });
};
