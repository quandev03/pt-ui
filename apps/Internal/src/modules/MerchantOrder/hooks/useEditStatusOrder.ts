import { NotificationSuccess } from '@react/commons/index';
import { prefixSaleServicePrivate } from '@react/url/app';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListOrder } from './useListOrder';

export interface Req {
  id: string;
  status: number;
  description?: string;
}

export const queryKeyMerchantOrder = 'query-edit-status-';

const fetcher = (body: Req) => {
  return axiosClient.put<Req, Response>(
    `/${prefixSaleServicePrivate}/delivery-order-ncc/cancel`,
    body
  );
};

export const useEditStatusOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyMerchantOrder],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListOrder],
      });
      NotificationSuccess(MESSAGE.G17);
    },
  });
};
