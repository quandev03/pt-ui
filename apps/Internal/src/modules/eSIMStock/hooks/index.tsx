import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { IeSIMStockParams } from '../types';
import { eSIMStockServices } from '../services';
import { AnyElement } from '@vissoft-react/common';
import { apiUtils } from 'apps/Internal/src/services';

export const useGeteSIMStock = (params: IeSIMStockParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_E_SIM_STOCK, params],
    queryFn: () => eSIMStockServices.geteSIMStock(params),
  });
};

export const useGetDetaileSIMStock = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_E_SIM_STOCK_DETAIL, id],
    queryFn: () => eSIMStockServices.getDetaileSIMStock(id),
    enabled: !!id,
  });
};

export const useGetAllPackage = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_PACKAGE],
    queryFn: () => eSIMStockServices.getPackage(),
  });
};

export const useGetCustomerInfo = (id: string) => {
  return useQuery({
    queryKey: ['get-customer-info-detail-esim', id],
    queryFn: () => eSIMStockServices.getCustomerInfo(id),
    enabled: !!id,
  });
};
