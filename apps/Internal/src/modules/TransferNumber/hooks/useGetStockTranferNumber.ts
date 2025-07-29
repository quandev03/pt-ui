import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../services/service';
import { IParams } from '../type';
import { QUERY_KEY } from './key';

export const useGetStockTranferNumber = (params: IParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_STOCK_TRANSFER_NUMBER, params],
    queryFn: () => fetcher(params),
  });
};
