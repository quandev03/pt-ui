import { prefixResourceServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

interface StockSimType {
  stockId: string;
  stockCode: string;
  stockName: string;
}

export const queryKeyListStockSim = 'query-list-stock-sim';

const fetcher = (value: string) => {
  return axiosClient.get<string, StockSimType[]>(
    `${prefixResourceServicePublic}/sim-registrations/get-list-stock-isdn?q=${value}`
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
