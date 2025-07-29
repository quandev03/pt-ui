import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import {
  CancelSubscriberHistory,
  CancelSubscriberHistoryRequest,
} from '../types';

const fetcher = (params: CancelSubscriberHistoryRequest) => {
  const { enterpriseId, ...rest } = params;
  return axiosClient.get<
    CancelSubscriberHistoryRequest,
    IPage<CancelSubscriberHistory>
  >(
    `${prefixCustomerService}/search-subscriber-enterprise/${enterpriseId}/cancel-subscriber-history`,
    { params: rest }
  );
};

export const useCancelSubscriberHistoryQuery = (
  params: CancelSubscriberHistoryRequest
) => {
  delete params.tab;
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: ['GET_LIST_CANCEL_SUBSCRIBER_HISTORY', params],
    enabled: !!params.enterpriseId,
  });
};
