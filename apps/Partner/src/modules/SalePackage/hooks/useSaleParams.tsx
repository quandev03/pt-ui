// src/features/Sale/hooks/useGetSaleParams.ts
import { useQuery } from '@tanstack/react-query';
import { ISaleParamsResponse } from '../types';
import { IErrorResponse } from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../constants/query-key';
import { packageSaleService } from '../services';

export const useGetSaleParams = () => {
  return useQuery<ISaleParamsResponse, IErrorResponse>({
    queryKey: [REACT_QUERY_KEYS.GET_SALE_PARAMS],
    queryFn: packageSaleService.getSaleParams,
  });
};
