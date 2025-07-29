import { axiosClient } from 'apps/Internal/src/service';

import { prefixCustomerService } from '@react/url/app';
import { IFeedbackType } from '../../Feedback/types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const getListFeedbackType = async () => {
  const res: IFeedbackType[] = await axiosClient.get(
    `${prefixCustomerService}/feedback-type`
  );
  return res || [];
};
export const useFetchFeedbackTypes = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_FEEDBACK_TYPE],
    queryFn: () => getListFeedbackType(),
  });
};
