import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { AnyElement, IErrorResponse } from '@react/commons/types';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const cancelUploadForm = (id: number) => {
  return axiosClient.put<number, AnyElement>(
    `${prefixResourceService}/stock-product-upload-order/cancel-order/${id}`
  );
};
export const useCancelUploadForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelUploadForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_UPLOAD_SIM_FORM_LIST],
      });
      NotificationSuccess(MESSAGE.G17);
    },
    onError: (error: IErrorResponse) => {
      NotificationError(error.detail);
    },
  });
};
