import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ImpactRequest } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (params: ImpactRequest) => {
  if (params.listSubID) {
    return axiosClient.put<ImpactRequest, Response>(
      `${prefixCustomerService}/search-request/list-action-sub`,
      params
    );
  }

  return axiosClient.post<ImpactRequest, Response>(
    `${prefixCustomerService}/search-request/close-open-action-sub`,
    params
  );
};

export const useImpactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: (_, variables) => {
      if (variables.listSubID) {
        queryClient.invalidateQueries({
          queryKey: [REACT_QUERY_KEYS.GET_LIST_SUBSCRIBER_NO_IMPACT],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SUBSCRIPTION],
        });
      }
    },
  });
};
