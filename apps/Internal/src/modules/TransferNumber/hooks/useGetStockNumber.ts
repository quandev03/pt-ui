import { useQuery } from '@tanstack/react-query';
import { getStockNumber } from '../services/service';

export const useGetStockNumber = (stockId?: number) => {
  return useQuery({
    queryKey: ['useGetStockNumberKey', stockId],
    queryFn: () => getStockNumber(stockId),
    enabled: !!stockId,
  });
};
