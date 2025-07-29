import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import {
  BlockOpenSubscriberHistory,
  BlockOpenSubscriberHistoryRequest,
} from '../types';

const fetcher = (params: BlockOpenSubscriberHistoryRequest) => {
  const { enterpriseId, ...rest } = params;
  return axiosClient.get<
    BlockOpenSubscriberHistoryRequest,
    IPage<BlockOpenSubscriberHistory>
  >(
    `${prefixCustomerService}/search-subscriber-enterprise/${enterpriseId}/block-open-subscriber-history`,
    { params: rest }
  );
};

export const useBlockOpenSubscriberHistoryQuery = (
  params: BlockOpenSubscriberHistoryRequest
) => {
  delete params.tab;
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: ['GET_LIST_BLOCK_OPEN_SUBSCRIBER_HISTORY', params],
    enabled: !!params.enterpriseId,
  });
};
