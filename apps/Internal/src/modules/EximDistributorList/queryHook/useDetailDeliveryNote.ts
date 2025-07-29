import { useMutation } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (id: string) => {
  return axiosClient.get(`${prefixSaleService}/delivery-note/${id}`);
};

export const useDetailDeliveryNote = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      return data;
    },
  });
};
