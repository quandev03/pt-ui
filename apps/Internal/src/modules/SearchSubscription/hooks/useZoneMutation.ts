import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ZoneRequest } from '../types';
import { NotificationSuccess } from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';

const fetcher = ({ id, ...params }: ZoneRequest) => {
  return axiosClient.post<string, Response>(
    `${prefixCustomerService}/search-request/change-zone/${id}`,
    { ...params }
  );
};

export const useZoneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SUBSCRIPTION],
      });
      NotificationSuccess('Đổi Zone thành công');
    },
  });
};
