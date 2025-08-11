import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUnKeepIsdn } from '../services';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { NotificationSuccess } from '@vissoft-react/common';

export const useUnKeepIsdn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getUnKeepIsdn,
    mutationKey: [REACT_QUERY_KEYS.GET_UN_KEEP_ISDN],
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_SEARCH_NUMBER],
      });
      NotificationSuccess('Bỏ số thành công !');
    },
  });
};
