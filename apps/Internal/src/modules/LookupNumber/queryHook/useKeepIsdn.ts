import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getKeepIsdn } from '../services';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/query-key';
import { NotificationSuccess } from '@vissoft-react/common';

export const useKeepIsdn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getKeepIsdn,
    mutationKey: [REACT_QUERY_KEYS.GET_KEEP_ISDN],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_SEARCH_NUMBER],
      });
      NotificationSuccess('Giữ số thành công !');
    },
  });
};
