import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { FeedbackHistoryRequest, FeedbackHistory } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (params: FeedbackHistoryRequest) => {
  return axiosClient.get<FeedbackHistoryRequest, IPage<FeedbackHistory>>(
    `${prefixCustomerService}/feedback-request/get-feedback-by-isdn`,
    { params }
  );
};

export const useFeedbackHistoryQuery = (params: FeedbackHistoryRequest) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_FEEDBACK_HISTORY, params],
    enabled: !!params.isdn,
  });
};
