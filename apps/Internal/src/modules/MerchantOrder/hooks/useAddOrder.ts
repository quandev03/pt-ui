import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListOrder } from './useListOrder';
import { prefixSaleService } from '@react/url/app';

export const queryKeyConfig = 'query-combine-individual-kits';

export interface RequestAddOrder {
  payload: any;
  listFile: any[];
}

const fetcher = ({ payload, listFile }: RequestAddOrder) => {
  const formData = new FormData();
  const deliveryOrder = new Blob([JSON.stringify(payload)], {
    type: 'application/json',
  });
  formData.append('deliveryOrder', deliveryOrder);
  listFile?.forEach((file) => {
    formData.append('attachmentFiles', file);
  });
  return axiosClient.post<Request, Response>(
    `${prefixSaleService}/delivery-order/create-ticket`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useAddOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyConfig],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListOrder],
      });
    },
  });
};
