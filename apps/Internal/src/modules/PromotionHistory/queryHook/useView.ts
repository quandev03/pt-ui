import { axiosClient } from 'apps/Internal/src/service';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';

const fetcher = async (id: string) => {
  return await axiosClient.get<any>(
    `${prefixCustomerService}/promotion/execute/${id}`
  );
};

export const useView = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_PROMOTION_HISTORY, id],
    queryFn: () => fetcher(id),
    select: (data: any) => data,
    enabled: !!id,
  });
};

