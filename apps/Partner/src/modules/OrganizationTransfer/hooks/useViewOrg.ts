import { prefixSaleService } from '@react/url/app';
import { getDayjs } from '@react/utils/datetime';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { OrgTransferType } from '../types';

export const queryKeyViewOrg = 'query-detail-organization-transfer';

const fetcher = (id: string | undefined) => {
  return axiosClient.get<string, OrgTransferType>(
    `${prefixSaleService}/stock-move/${id}`
  );
};

export const useViewOrgById = (onSuccess: (data: OrgTransferType) => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};

export const useViewOrg = (id: string | undefined) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyViewOrg, id],
    select: ({
      orderDate,
      attachmentsDTOS,
      deliveryOrgLineDTOS,
      ...data
    }: any) => ({
      ...data,
      orderDate: getDayjs(orderDate),

      products: deliveryOrgLineDTOS?.map((e: any) => ({
        ...e,
        ...e?.productDTO,
        productUom: e?.productDTO?.productUom,
      })),
    }),
    enabled: !!id,
  });
};
