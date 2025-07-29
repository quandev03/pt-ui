import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (enterpriseId: string, subId: string) => {
  return axiosClient.get<string, any>(
    `${prefixCustomerService}/search-subscriber-enterprise/${enterpriseId}/subscribers/${subId}`
  );
};

export const useDetailSubscriberQuery = (enterpriseId = '', subId = '') => {
  return useQuery({
    queryFn: () => fetcher(enterpriseId, subId),
    queryKey: ['GET_DETAIL_SUBSCRIBER_ENTERPRISE', enterpriseId, subId],
    enabled: !!enterpriseId && !!subId,
  });
};
