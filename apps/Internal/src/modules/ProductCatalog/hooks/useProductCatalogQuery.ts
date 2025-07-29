import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ProductCatalog, ProductCatalogRequest } from '../types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = (params: ProductCatalogRequest) => {
  return axiosClient.get<ProductCatalogRequest, ProductCatalog[]>(
    `${prefixCatalogService}/product/search`,
    { params }
  );
};

export const useProductCatalogQuery = (params: ProductCatalogRequest) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PRODUCT_CATALOG, params],
  });
};
