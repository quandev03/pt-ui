import { axiosClient } from 'apps/Internal/src/service';
import { ISupplierItem, ISupplierParams } from '../types';
import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = (params: ISupplierParams) => {
  return axiosClient.get<ISupplierParams, IPage<ISupplierItem>>(
    `${prefixCatalogService}/supplier`,
    { params }
  );
};
export const useList = (params: ISupplierParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_SUPPLIER_LIST, params],
    queryFn: () => fetcher(params),
  });
};
