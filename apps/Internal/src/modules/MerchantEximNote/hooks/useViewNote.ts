import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { MerchantNoteType } from '../types';
import { getDate, getDayjs } from '@react/utils/datetime';
import { DateFormat } from '@react/constants/app';
import { prefixSaleService } from '@react/url/app';

export const queryKeyViewNote = 'query-detail-delivery-order';

const fetcher = (id: string | undefined) => {
  return axiosClient.get<string, MerchantNoteType>(
    `${prefixSaleService}/delivery-note/${id}`
  );
};

export const useViewNote = (id: string | undefined) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyViewNote, id],
    select: ({
      deliveryNoteDate,
      attachments,
      deliveryNoteLines,
      ...data
    }: any) => ({
      ...data,
      deliveryNoteDate: getDayjs(deliveryNoteDate),
      files: attachments?.map((e: any) => ({
        id: e.id,
        name: e.fileName,
        desc: e.description,
        date: e.createdDate,
        size: e.fileVolume,
      })),
      products: deliveryNoteLines?.map((e: any) => ({
        ...e,
        ...e?.productDTO,
        productUom: e?.productDTO?.productUom,
      })),
    }),
    enabled: !!id,
  });
};

export const useMutateNote = () => {
  return useMutation({
    mutationFn: async (id: string | undefined) => {
      const res = await fetcher(id);
      return {
        id: res?.id,
        orgId: res.toOrgId,
        deliveryNoteCode: res.deliveryNoteCode,
        deliveryNoteDate: res.deliveryNoteDate,
        orgOptions: { value: res.toOrgId, label: res.toOrgName },
        products: res?.deliveryNoteLines?.map((e: any) => ({
          productId: res?.id,
          orgId: res.toOrgId,
          productCode: e?.productDTO.productCode,
          productUom: e?.productDTO.productUom,
          productName: e?.productDTO.productName,
          fromSerial: e?.fromSerial,
          toSerial: e?.toSerial,
          quantity: e?.quantity,
        })),
      };
    },
  });
};
