import { useQuery } from '@tanstack/react-query';
import { getDetailTransaction } from '../services';

export const useGetDetailTransactionKey = 'useGetChooseProductKey';
export const useGetDetailTransaction = (id?: string) => {
  return useQuery({
    queryFn: () => getDetailTransaction(id!),
    queryKey: [useGetDetailTransactionKey, id],
    enabled: !!id,
  });
};
