import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { SubscriptionDetail } from '../types';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (id: string, isAdmin?: boolean) => {
  return axiosClient.get<string, SubscriptionDetail>(
    `${prefixCustomerService}/search-request/${
      isAdmin ? 'admin' : 'cskh'
    }/${id}`
  );
};

export const useDetailSubscriptionQuery = (id: string, isAdmin?: boolean) => {
  return useQuery({
    queryFn: () => fetcher(id, isAdmin),
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SUBSCRIPTION, id, isAdmin],
    enabled: !!id,
  });
};
