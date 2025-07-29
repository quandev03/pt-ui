import { IPage } from '@react/commons/types';
import { prefixEventService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import {
  IEnterpriseHistoryItem,
  IEnterpriseHistoryParam,
} from '../components/EnterpriseHistory/types';
import dayjs from 'dayjs';

const fetcher = (params: IEnterpriseHistoryParam) => {
  return axiosClient.get<
    IEnterpriseHistoryParam,
    IPage<IEnterpriseHistoryItem>
  >(`${prefixEventService}/audit-enterprise-logs`, { params });
};
export const useGetEnterpriseHistoryList = (
  params: IEnterpriseHistoryParam
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ENTERPRISE_HISTORY_LIST, params],
    queryFn: () => fetcher(params),
    enabled: dayjs(params.startTime).isValid(),
  });
};
