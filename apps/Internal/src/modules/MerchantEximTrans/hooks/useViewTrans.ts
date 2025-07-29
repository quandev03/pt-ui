import { getDayjs } from '@react/utils/datetime';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { MerchantTransType } from '../types';
import { prefixSaleService } from '@react/url/app';

export const queryKeyViewTrans = 'query-detail-stock-move';

const fetcher = (id: string | undefined) => {
  return axiosClient.get<string, MerchantTransType>(
    `${prefixSaleService}/stock-move/${id}`
  );
};

export const useViewTrans = (id: string | undefined) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyViewTrans, id],
    select: ({
      moveDate,
      stockMoveLineDTOS,
      deliveryNoteId,
      ...data
    }: any) => ({
      ...data,
      noteCode: deliveryNoteId,
      moveDate: getDayjs(moveDate),
      products: stockMoveLineDTOS?.map((e: any) => ({
        ...e,
        ...e?.productDTO,
        productUom: e?.productDTO?.productUom,
      })),
    }),
    enabled: !!id,
  });
};
