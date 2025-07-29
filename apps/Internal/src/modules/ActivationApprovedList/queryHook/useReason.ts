import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface ItemReject {
  saveForm: boolean;
  reasonReject: string;
  id: number;
}

const fetcher = () => {
  return axiosClient.get<any>(`${prefixCustomerService}/reason`, {
    params: {
      type: 'PRE_APPROVE',
    },
  });
};

export const useReason = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_REASON_REJECT],
    queryFn: () => fetcher(),
    select: (data: any) => data,
  });
};
