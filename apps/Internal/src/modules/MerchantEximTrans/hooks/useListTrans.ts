import { DeliveryOrderType } from '@react/constants/app';
import { useQuery } from '@tanstack/react-query';
import { prefixSaleService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import { MerchantTransType } from '../types';

export interface Req {
  q: string;
  moveType?: number;
  moveMethod?: number;
  page: number;
  size: number;
}

interface Res {
  content: MerchantTransType[];
  totalElements: number;
  size: number;
}

export const queryKeyListTrans = 'query-list-stock-move-ncc';

const fetcher = (params: Req) => {
  return axiosClient.get<Req, Res>(`${prefixSaleService}/stock-move`, {
    params: {
      ...params,
      moveType: DeliveryOrderType.NCC,
    },
  });
};

export const useListMerchantTrans = (params: Req) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [queryKeyListTrans, params],
    select: (data: Res) => data,
    enabled: true,
  });
};
