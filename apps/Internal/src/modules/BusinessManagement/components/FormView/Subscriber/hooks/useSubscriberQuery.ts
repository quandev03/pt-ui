import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import { Subscriber, SubscriberRequest } from '../types';

const fetcher = (params: SubscriberRequest) => {
  const { enterpriseId, ...rest } = params;
  return axiosClient.get<SubscriberRequest, IPage<Subscriber>>(
    `${prefixCustomerService}/search-subscriber-enterprise/${enterpriseId}/subscribers`,
    { params: rest }
  );
};

export const useSubscriberQuery = (params: SubscriberRequest) => {
  delete params.tab;
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: ['GET_LIST_SUBSCRIBER_ENTERPRISE', params],
    enabled: !!params.enterpriseId,
  });
};
