import { NotificationError } from '@react/commons/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { MESSAGE } from '@react/utils/message';
import { MerchantOrderType } from '../types';
import { DeliveryOrderType, SELECT_SIZE } from '@react/constants/app';
import {
  CurrentStatusList,
  DeliveryOrderStatusList,
} from '@react/constants/status';
import { prefixSaleService } from '@react/url/app';

export interface Req {
  q: string;
  approvalStatus?: number;
  fromDate?: string;
  toDate?: string;
  supplierId?: number;
  orderStatus?: number;
  orderStatusList?: number[];
  page: number;
  size: number;
}

interface Res {
  content: MerchantOrderType[];
  totalElements: number;
  size: number;
}

export const queryKeyListOrder = 'query-list-delivery-order';

const fetcher = (body: Req) => {
  const { page, size, ...rest } = body;
  return axiosClient.post<Req, Res>(
    `${prefixSaleService}/delivery-order/search`,
    { ...rest, deliveryOrderType: DeliveryOrderType.NCC },
    {
      params: { page, size },
    }
  );
};

export const useListMerchantOrder = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyListOrder, body],
    select: (data: Res) => data,
    enabled: true,
  });
};

export const useMutateListOrder = () => {
  return useMutation({
    mutationFn: (keySearch: string) =>
      fetcher({
        q: keySearch,
        page: 0,
        size: SELECT_SIZE,
        orderStatusList: [
          DeliveryOrderStatusList.CREATE,
          DeliveryOrderStatusList.PROGRESS,
        ], //params DELIVERY_ORDER_ORDER_STATUS
        approvalStatus: CurrentStatusList.REFUSE, //param APPROVAL_HISTORY_STEP_STATUS
      }).then(
        (res) =>
          res?.content?.map((e) => ({
            ...e,
            value: e.id,
            label: e.orderNo,
          })) ?? []
      ),
  });
};
