import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (params: any) => {
  return axiosClient.post(
    `${prefixSaleService}/stock-product/auto-filter-serial`,
    [params]
  );
};

export const useSuggestSerialNumber = () => {
  return useMutation({
    mutationFn: (params: {
      productId: number;
      quantity: number;
      orgId: number;
      fromSerial?: number;
      type?: number;
    }) => fetcher(params),
  });
};
