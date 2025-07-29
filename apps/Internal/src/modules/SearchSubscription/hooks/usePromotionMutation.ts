import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { PromotionRequest } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (params: PromotionRequest) => {
  return axiosClient.post<PromotionRequest, Response>(
    `${prefixCustomerService}/reg-del-prom`,
    { ...params }
  );
};

export const usePromotionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_SUBSCRIPTION],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SUBSCRIPTION],
      });
    },
  });
};
