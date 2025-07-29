import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { MerchantOrderType } from '../types';
import { getDate, getDayjs } from '@react/utils/datetime';
import { DateFormat } from '@react/constants/app';
import dayjs from 'dayjs';
import { prefixSaleService } from '@react/url/app';

export const queryKeyViewOrder = 'query-detail-delivery-order';

const fetcher = (id: string | undefined) => {
  return axiosClient.get<string, MerchantOrderType>(
    `${prefixSaleService}/delivery-order/${id}`
  );
};

export const useViewOrder = (
  id: string | undefined,
  isEnabledRequest = true
) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyViewOrder, id],
    select: ({
      orderDate,
      attachmentsDTOS,
      deliveryOrderLineDTOS,
      ...data
    }: any) => ({
      ...data,
      orderDate: getDayjs(orderDate),
      files: attachmentsDTOS?.map((e: any) => ({
        id: e.id,
        name: e.fileName,
        desc: e.description,
        date: e.createdDate,
        size: e.fileVolume,
      })),
      products: deliveryOrderLineDTOS?.map((e: any) => ({
        ...e,
        ...e?.productDTO,
        productUom: e?.productDTO?.productUom,
      })),
    }),
    enabled: !!id && isEnabledRequest,
  });
};

export const useMutateOrder = () => {
  return useMutation({
    mutationFn: async (id: string | undefined) => {
      const res = await fetcher(id);
      return {
        orderDate: dayjs(res?.orderDate),
        id: res.id,
        orderNo: res.orderNo,
        toOrgId: res.toOrgId,
        orgOptions: { value: res.toOrgId, label: res.toOrgName },
        products: res?.deliveryOrderLineDTOS
          ?.map((e: any) => ({
            productName: e?.productDTO?.productName,
            productUom: e?.productDTO?.productUom,
            productCode: e?.productDTO?.productCode,
            productId: e?.id,
            deliveryOrderLineId: e?.id,
            quantity: e?.quantity - e?.deliveriedQuantity || 0,
          }))
          ?.filter((c) => c.quantity),
      };
    },
  });
};
