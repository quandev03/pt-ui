import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const deleteApi = (id: string) => {
  return axiosClient.delete<any>(
    `${prefixCatalogService}/organization-unit` + `/${id}`
  );
};

export const useDeleteFn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_DEPARTMENT],
      });
      NotificationSuccess(MESSAGE.G03);
    },
  });
};
