import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { Subscription, SubscriptionRequest } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (params: SubscriptionRequest) => {
  const { isAdmin, isSearch, ...rest } = params;
  return axiosClient.get<SubscriptionRequest, IPage<Subscription>>(
    `${prefixCustomerService}/search-request/${isAdmin ? 'admin' : 'cskh'}`,
    { params: rest }
  );
};

export const useSubscriptionQuery = (params: SubscriptionRequest) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_SUBSCRIPTION, params],
    enabled:
      params.isAdmin || !!params.isdn || !!params.serial || !!params.idNo,
  });
};
