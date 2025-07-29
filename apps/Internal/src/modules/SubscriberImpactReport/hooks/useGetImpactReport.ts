import { axiosClient } from 'apps/Internal/src/service';
import { IImpactReportParams, ISubscriberImpactReportItem } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = (params: IImpactReportParams) => {
  return axiosClient.get<
    IImpactReportParams,
    IPage<ISubscriberImpactReportItem>
  >(`${prefixCustomerService}/impact-by-file`, { params });
};
export const useGetImpactReport = (params: IImpactReportParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_SUBSCRIBER_IMPACT_REPORT, params],
    queryFn: () => fetcher(params),
  });
};
