import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  NotificationSuccess,
  NotificationError,
} from '@react/commons/Notification';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const deleteApi = (id: string) => {
  return axiosClient.delete<any>(
    `/${prefixCustomerService}/sale-employee`, {
      params: {
        id: id
      }
    }
  );
};

export const useDeleteFn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_SALE_AND_AM],
      });
      NotificationSuccess('Xóa thành công');
    },
  });
};
