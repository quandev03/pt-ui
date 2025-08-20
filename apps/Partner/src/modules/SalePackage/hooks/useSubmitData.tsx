import { useMutation } from '@tanstack/react-query';
import { safeApiClient } from '../../../../src/services';
import { prefixSaleService } from '../../../../src/constants';
import { AnyElement, NotificationSuccess } from '@vissoft-react/common';
import { AxiosRequestHeaders } from 'axios';

export const useSubmitData = (onSuccess: () => void, onError?: () => void) => {
  return useMutation({
    mutationFn: (payload: FormData) => {
      return safeApiClient.post(
        `${prefixSaleService}/sale-package/submit-data`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          } as AxiosRequestHeaders,
        }
      );
    },
    onSuccess: (data: AnyElement) => {
      onSuccess && onSuccess();
      NotificationSuccess(data.message || 'Bán gói theo lô thành công!');
    },
    onError: (error: AnyElement) => {
      onError && onError();
      console.log(error);
    },
  });
};
