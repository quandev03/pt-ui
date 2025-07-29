import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { SubscriberCurrentStatus } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (id: string) => {
  return axiosClient.get<string, SubscriberCurrentStatus>(
    `${prefixCustomerService}/search-request/ocs/${id}`
  );
};

export const useSubscriberStatusQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_SUBSCRIBER_STATUS, id],
    enabled: !!id && enabled,
  });
};
