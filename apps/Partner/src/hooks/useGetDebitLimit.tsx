import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../constants/query-key';
import { globalService } from '../services';

export interface IDebitLimit {
  debitLimit: number;
  debitLimitMbf: number;
}

export const useGetDebitLimit = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_DEBIT_LIMIT],
    queryFn: () => globalService.getDebitLimit(),
  });
};
