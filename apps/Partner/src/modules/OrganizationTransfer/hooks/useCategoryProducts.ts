import { prefixCatalogServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';

import { axiosClient } from 'apps/Partner/src/service';
const queryKeyCategoryProducts = 'query-category-products';
const fetcher = (orgId: number | undefined) => {
  const res = axiosClient.get<any, any>(
    `${prefixCatalogServicePublic}/product-category/get-available-category-in-stock/${orgId}`
  );
  return res;
};
const useCategoryProducts = (orgId: number | undefined) => {
  return useQuery({
    queryFn: () => fetcher(orgId),
    queryKey: [queryKeyCategoryProducts, orgId],
    select: (data: any) => data,
    enabled: !!orgId,
  });
};
export default useCategoryProducts;

