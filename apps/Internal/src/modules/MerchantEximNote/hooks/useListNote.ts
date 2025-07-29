import { DeliveryOrderType, SELECT_SIZE } from '@react/constants/app';
import { prefixSaleService } from '@react/url/app';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { MerchantNoteType } from '../types';
import { CurrentStatusList } from '@react/constants/status';

export interface Req {
  q: string;
  deliveryNoteType?: number;
  deliveryNoteMethod?: number;
  deliveryNoteStatus?: number;
  page: number;
  size: number;
}

interface Res {
  content: MerchantNoteType[];
  totalElements: number;
  size: number;
}

export const queryKeyListNote = 'query-list-delivery-note-ncc';

const fetcher = (params: Req) => {
  return axiosClient.get<Req, Res>(`${prefixSaleService}/delivery-note`, {
    params: {
      ...params,
      deliveryNoteType: DeliveryOrderType.NCC,
    },
  });
};

export const useListMerchantNote = (params: Req) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [queryKeyListNote, params],
    select: (data: Res) => data,
    enabled: true,
  });
};

export const useMutateListNote = () => {
  return useMutation({
    mutationFn: (keySearch: string) =>
      fetcher({
        q: keySearch,
        page: 0,
        size: SELECT_SIZE,
        deliveryNoteStatus: CurrentStatusList.PENDING, //param DELIVERY_NOTE_STATUS
      }).then(
        (res) =>
          res?.content?.map((e) => ({
            ...e,
            value: e.id,
            label: e.deliveryNoteCode,
          })) ?? []
      ),
  });
};
