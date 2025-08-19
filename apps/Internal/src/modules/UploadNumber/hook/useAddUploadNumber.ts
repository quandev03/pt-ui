import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MESSAGE, NotificationSuccess } from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { safeApiClient } from 'apps/Internal/src/services';
import { AxiosRequestHeaders } from 'axios';
import { urlUploadNumber } from '../services/url';
import { IFormUploadNumber } from '../types';

const fetcher = async (values: IFormUploadNumber) => {
  const { description, numberFile } = values;
  const formData = new FormData();
  if (numberFile) {
    formData.set('numberFile', numberFile);
  }
  const metadata = {
    description: description,
  };
  formData.set(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  const res = await safeApiClient.post<Blob>(urlUploadNumber, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    } as AxiosRequestHeaders,
  });
  return res;
};
const useAddUploadNumber = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_NUMBER],
      });
      onSuccess();
    },
  });
};
export default useAddUploadNumber;
