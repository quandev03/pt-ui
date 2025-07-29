import { IPage } from '@react/commons/types';
import { prefixCatalogService } from '@react/url/app';
import { useInfiniteQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

export type IParamsInfiniteQuery = {
  page: number;
  size: number;
  categoryTypes?: number[];
  valueSearch?: string;
  categoryIds?: number[];
};

const fetcher = (params: IParamsInfiniteQuery) => {
  const { page, size, valueSearch } = params;
  console.log('🚀 ~ fetcher ~ valueSearch:', valueSearch);
  return axiosClient.post<string, IPage<any>>(
    `${prefixCatalogService}/product/search-products-for-import?page=${page}&size=${size}`,
    {
      categoryTypes: [1, 2, 3],
      valueSearch,
    }
  );
};

export const useInfinityScrollProducts = (params: IParamsInfiniteQuery) => {
  return useInfiniteQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PRODUCTS, params],
    initialPageParam: params.page,
    queryFn: ({ pageParam = 0 }) => {
      return fetcher({
        page: pageParam,
        valueSearch: params.valueSearch,
        size: 20,
      });
    },
    select: (data) => {
      const { pages } = data;
      const result: any[] = [];
      pages.forEach((item) => {
        item.content.forEach((user: any) => {
          result.push(user);
        });
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.number >= lastPage.totalPages - 1) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};
