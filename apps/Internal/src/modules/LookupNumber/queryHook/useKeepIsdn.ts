import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getKeepIsdn } from '../services';
import { QUERY_KEY } from '../constant';
import { NotificationSuccess } from '@react/commons/index';

export const useKeepIsdn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getKeepIsdn,
    mutationKey: [QUERY_KEY.GET_KEEP_ISDN],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GET_SEARCH_NUMBER],
      });
      NotificationSuccess('Giữ số thành công !');
    },
  });
};
