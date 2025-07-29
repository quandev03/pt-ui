import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import {
  NotificationSuccess,
  NotificationError,
} from '@react/commons/Notification';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const deleteApi = (id: string) => {
  return axiosClient.delete<any>(`${prefixCatalogService}/reason` + `/${id}`);
};

export const useDeleteFn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_REASONS],
      });
      NotificationSuccess('Xóa thành công!');
    },
  });
};
