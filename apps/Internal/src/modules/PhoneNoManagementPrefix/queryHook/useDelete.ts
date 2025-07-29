import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import {
  NotificationSuccess,
  NotificationError,
} from '@react/commons/Notification';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { IErrorResponse } from '@react/commons/types';

const deleteApi = (id: string) => {
  return axiosClient.delete<any>(
    `${prefixCatalogService}/isdn-prefix` + `/${id}`
  );
};

export const useDeleteFn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_PHONE_NO_PREFIX],
      });
      NotificationSuccess('Xóa thành công!');
    },
    onError: (err: IErrorResponse) => {
      if (!err.errors || err.errors.length === 0) {
        NotificationError(err?.detail);
      } else {
        NotificationError(err?.message);
      }
    },
  });
};
