import { useMutation } from '@tanstack/react-query';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';
import { axiosClient } from 'apps/Internal/src/service';
import { urlRevokeNumber } from '../services';

const fetcher = (id: string) => {
  return axiosClient.get<string, INumberTransactionDetail>(
    `${urlRevokeNumber}/${id}`
  );
};
export const useGetRevokeNumberDetail = (
  onSuccess: (data: INumberTransactionDetail) => void
) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess(data) {
      onSuccess(data);
    },
  });
};
