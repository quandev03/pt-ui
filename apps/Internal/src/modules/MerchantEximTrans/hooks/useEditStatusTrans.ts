import { NotificationSuccess } from '@react/commons/index';
import { DeliveryOrderMethod } from '@react/constants/app';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListTrans } from './useListTrans';
import { prefixSaleService } from '@react/url/app';

export interface Req {
  id: string;
  status: DeliveryOrderMethod;
  description?: string;
}

export const queryKeyMerchantTrans = 'query-edit-status-merchant-note';

const fetcher = ({ id, status }: Req) => {
  return axiosClient.put<Req, Response>(
    `${prefixSaleService}/stock-move/${id}?status=${status}`
  );
};

export const useEditStatusTrans = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyMerchantTrans],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListTrans],
      });
      NotificationSuccess(MESSAGE.G17);
    },
  });
};
