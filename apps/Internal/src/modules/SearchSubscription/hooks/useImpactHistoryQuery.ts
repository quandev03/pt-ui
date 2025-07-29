import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ImpactHistoryRequest, ImpactHistory } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (id: string, params: ImpactHistoryRequest) => {
  return axiosClient.get<ImpactHistoryRequest, IPage<ImpactHistory>>(
    `${prefixCustomerService}/search-request/action-history/${id}`,
    { params }
  );
};

export const useImpactHistoryQuery = (
  id: string,
  params: ImpactHistoryRequest
) => {
  return useQuery({
    queryFn: () => fetcher(id, params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_IMPACT_HISTORY, id, params],
    enabled: !!id,
  });
};
