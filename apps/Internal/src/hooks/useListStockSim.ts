import { useQuery } from '@tanstack/react-query';
import { prefixResourceService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface StockSimType {
  stockId: number;
  stockCode: string;
  stockName: string;
}

export const queryKeyListStockSim = 'query-list-stock-sim';

const fetcher = (value: string) => {
  return axiosClient.get<string, StockSimType[]>(
    `${prefixResourceService}/sim-registrations/get-list-stock-isdn?q=${value}`
  );
};

export const useListStockSim = (value: string) => {
  return useQuery({
    queryFn: () => fetcher(value),
    queryKey: [queryKeyListStockSim, value],
    select: (data = []) =>
      data.map((e) => ({
        value: e.stockId,
        label: e.stockName,
      })),
    enabled: true,
  });
};
