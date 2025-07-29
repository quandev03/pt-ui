import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import {
  SubscriberImpactByFileRequest,
  SubscriberImpactByFile,
} from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (params: SubscriberImpactByFileRequest) => {
  return axiosClient.get<
    SubscriberImpactByFileRequest,
    IPage<SubscriberImpactByFile>
  >(`${prefixCustomerService}/search-request/get-impact-sub-result`, {
    params,
  });
};

export const useSubscriberImpactByFileQuery = (
  params: SubscriberImpactByFileRequest
) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_SUBSCRIBER_IMPACT_BY_FILE, params],
  });
};
