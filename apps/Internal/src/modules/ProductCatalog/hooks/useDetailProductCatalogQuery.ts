import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ProductCatalogDetail } from '../types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = (id: string) => {
  return axiosClient.get<string, ProductCatalogDetail>(
    `${prefixCatalogService}/product/${id}`
  );
};

export const useDetailProductCatalogQuery = (id: string) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_PRODUCT_CATALOG, id],
    enabled: !!id,
  });
};
