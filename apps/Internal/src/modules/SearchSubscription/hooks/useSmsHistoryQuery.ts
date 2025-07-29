import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { SmsHistory, SmsHistoryRequest } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';
import { IPage } from '@react/commons/types';

const fetcher = (params: SmsHistoryRequest) => {
  const { id, ...rest } = params;
  return axiosClient.get<SmsHistoryRequest, IPage<SmsHistory>>(
    `${prefixCustomerService}/search-request/history-sms/${id}`,
    { params: rest }
  );
};

export const useSmsHistoryQuery = (params: SmsHistoryRequest) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_SMS_HISTORY, params],
    enabled: !!params.id,
  });
};
