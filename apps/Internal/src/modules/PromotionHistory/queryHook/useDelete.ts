import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import {
  NotificationSuccess,
  NotificationError,
} from '@react/commons/Notification';
import { prefixCustomerService } from '@react/url/app';

const deleteApi = (id: string) => {
  return axiosClient.delete<any>(
    `${prefixCustomerService}/reason/${id}`
  );
};

export const useDeleteFn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_REASON_CUSTOMER],
      });
      NotificationSuccess('Xóa thành công!');
    },
    onError: (err) => {
      NotificationError(err?.message);
    },
  });
};
