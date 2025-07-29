import { useMutation } from '@tanstack/react-query';
import { getTransferNumberDetail } from '../services/service';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';

export const useGetTransferNumberDetail = (
  onSuccess: (data: INumberTransactionDetail) => void
) => {
  return useMutation({
    mutationFn: getTransferNumberDetail,
    onSuccess(data) {
      onSuccess(data);
    },
  });
};
