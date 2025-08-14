import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { IeSIMStockParams } from '../types';
import { eSIMStockServices } from '../services';

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

export const useGetAllOrganizationUnit = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ORGANIZATION_UNIT],
    queryFn: () => eSIMStockServices.getOrganizationUnit(),
  });
};
