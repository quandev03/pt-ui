import { useQuery } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (id: string) => {
  return axiosClient.get(
    `${prefixSaleService}/stock-move/${id}`
  );
};

export const useDetailEximDistributor = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_EXIM_DISTRIBUTOR, id],
    queryFn: () => fetcher(id),
    select: (data: any) => data,
    enabled: !!id,
  });
};
