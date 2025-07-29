import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { SubscriberNoImpactRequest, SubscriberNoImpact } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (params: SubscriberNoImpactRequest) => {
  return axiosClient.get<SubscriberNoImpactRequest, IPage<SubscriberNoImpact>>(
    `${prefixCustomerService}/search-request/block-action-sub`,
    { params }
  );
};

export const useSubscriberNoImpactQuery = (
  params: SubscriberNoImpactRequest
) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_SUBSCRIBER_NO_IMPACT, params],
  });
};
