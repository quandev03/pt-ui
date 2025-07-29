import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ProductCatalog } from '../types';
import {prefixCatalogService} from "apps/Internal/src/constants/app";

const fetcher = () => {
  return axiosClient.get<Request, ProductCatalog[]>(
    `${prefixCatalogService}/product/groups`
  );
};

export const useProductGroupQuery = () => {
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PRODUCT_GROUP],
  });
};
