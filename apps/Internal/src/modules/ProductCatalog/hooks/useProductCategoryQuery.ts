import { IPage, ModelStatus } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ICategoryProduct } from '../../CategoryProduct/types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = () => {
  return axiosClient.get<Request, IPage<ICategoryProduct>>(
    `${prefixCatalogService}/product-category`,
    { params: { status: ModelStatus.ACTIVE } }
  );
};

export const useProductCategoryQuery = () => {
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_CATEGORY_PRODUCT],
    select: (data) => data.content,
  });
};
