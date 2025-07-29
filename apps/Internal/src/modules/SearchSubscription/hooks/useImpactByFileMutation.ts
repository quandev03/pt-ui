import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ImpactByFileRequest } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';
import { CommonError } from '@react/commons/types';
import { mapApiErrorToForm } from '@react/helpers/utils';
import { FormInstance } from 'antd';

const fetcher = (params: ImpactByFileRequest) => {
  const formData = new FormData();
  const metaData = JSON.stringify(params.metaData);
  formData.append('metaData', metaData);
  formData.append('actionFile', params.actionFile);

  return axiosClient.post<ImpactByFileRequest, Response>(
    `${prefixCustomerService}/search-request/upload-action-sim-file`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const useImpactByFileMutation = (form: FormInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_SUBSCRIBER_NO_IMPACT],
      });
    },
    onError: (error: CommonError) => mapApiErrorToForm(form, error.errors),
  });
};
