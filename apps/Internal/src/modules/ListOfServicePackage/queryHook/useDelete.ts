import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const deleteApi = (id: number) => {
  return axiosClient.delete(`${prefixCatalogService}/package-profile/${id}`);
};

export const useDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_SERVICE_PACKAGE],
      });
      NotificationSuccess('Xóa thành công');
    },
    onError: (err) => {
      NotificationError(err.message);
    },
  });
};
