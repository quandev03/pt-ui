import { NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListNote } from './useListNote';
import { prefixSaleServicePrivate } from '@react/url/app';

export interface Req {
  id: string;
  status: number;
}

export const queryKeyMerchantNote = 'query-edit-status-merchant-note';

const fetcher = ({ id, status }: Req) => {
  return axiosClient.put<Req, Response>(
    `/${prefixSaleServicePrivate}/delivery-note-in-ncc/${id}?status=${status}`
  );
};

export const useEditStatusNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyMerchantNote],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListNote],
      });
      NotificationSuccess(MESSAGE.G17b('phiếu'));
    },
  });
};
