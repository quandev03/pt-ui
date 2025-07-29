import { useQuery } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (params?: any) => {
  return axiosClient.get(`${prefixSaleService}/delivery-note`, {
    params,
  });
};

export const useListDeliveryNote = (params?: any) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_DELIVERY_NOTE, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data.content,
  });
};
