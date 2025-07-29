import { IPage } from '@react/commons/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { OrderType } from '../types';

export interface Req {
  q: string;
  page: number;
  size: number;
}

export const queryKeyGetSaleOrders = 'query-get-sale-orders';

const fetcher = (params?: Req) => {
  return axiosClient.get<Req, IPage<OrderType>>(
    `${prefixResourceService}/sim-registrations/order-list`,
    {
      params,
    }
  );
};

export const useGetOrderList = (body?: Req, isOpen?: boolean) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyGetSaleOrders, body, isOpen],
    select: (data: IPage<OrderType>) => data,
    enabled: isOpen,
  });
};

export const useMutateOrders = () => {
  return useMutation({
    mutationFn: ({ keySearch }: { keySearch: string }) =>
      fetcher({ q: keySearch, page: 0, size: 20 }).then(
        (res) =>
          res?.content?.map((e) => ({
            ...e,
            value: e.id,
            label: e.orderNo,
          })) ?? []
      ),
  });
};
