import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUnKeepIsdn } from '../services';
import { QUERY_KEY } from '../constant';
import { NotificationSuccess } from '@react/commons/index';

export const useUnKeepIsdn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getUnKeepIsdn,
    mutationKey: [QUERY_KEY.GET_UN_KEEP_ISDN],
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GET_SEARCH_NUMBER],
      });
      NotificationSuccess('Bỏ số thành công !');
    },
  });
};
