import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListConfig } from './useListConfig';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';

const fetcher = (id: string) => {
  return axiosClient.delete(`${prefixApprovalService}/approval-process/${id}`);
};

export const useDeleteConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListConfig],
      });
      NotificationSuccess(MESSAGE.G03);
    },
  });
};
