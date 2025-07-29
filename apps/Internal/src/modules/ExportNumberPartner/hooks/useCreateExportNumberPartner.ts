import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { blobToJson } from '@react/helpers/utils';
import { prefixResourceService } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { PayloadCreate } from '../types';

const fetcher = (data: PayloadCreate) => {
  const { orderId, stockId, description, numberFile } = data;
  const formData = new FormData();
  formData.append('numberFile', numberFile);
  formData.append(
    'metadata',
    new Blob([JSON.stringify({ orderId, stockId, description })], {
      type: 'application/json',
    })
  );
  return axiosClient.post<string, Blob>(
    `${prefixResourceService}/export-number-for-partner`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    }
  );
};

export const useCreateExportNumberPartner = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Thêm mới thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ExportNumberPartnerKey],
      });
      onSuccess();
    },
    async onError(error: any) {
      if (error instanceof Blob) {
        const parsedError = await blobToJson<IErrorResponse>(error);
        if (parsedError?.errors && parsedError?.errors.length > 0) {
          onError(parsedError.errors);
        } else {
          NotificationError(parsedError?.errors[0]?.detail);
        }
      } else {
        NotificationError(error?.errors[0]?.detail);
      }
    },
  });
};
