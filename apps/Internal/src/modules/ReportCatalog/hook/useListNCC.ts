import { axiosClient } from 'apps/Internal/src/service';
import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

export interface ISupplierParams {
  'search-string'?: string;
  status?: 1 | 0 | '';
}
export interface ISupplierItem {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  supplierCode: string;
  supplierName: string;
  status: number;
}

const fetcher = () => {
  return axiosClient.get<ISupplierParams, IPage<ISupplierItem>>(
    `${prefixCatalogService}/supplier`
  );
};
export const useListNCC = () => {
  return useQuery({
    queryKey: ['useListNCCKey'],
    queryFn: fetcher,
    select: (data) =>
      data.content.map((item) => ({
        label: item.supplierName,
        value: item.supplierCode,
      })),
  });
};
