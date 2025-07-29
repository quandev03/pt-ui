import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from './key';
import { getDetailDistributeNumber } from '../services';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';

export const useDetailDistributeNumber = (
  onSuccess: (data: INumberTransactionDetail) => void
) => {
  return useMutation({
    mutationFn: getDetailDistributeNumber,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
