import { IPage, IParamsRequest } from '@react/commons/types';
import {
  prefixCatalogService,
  prefixCatalogServicePublic,
} from '@react/url/app';
import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (params: IParamsRequest, id?: string) => {
  return axiosClient.get<string, IPage<any>>(
    `${prefixCatalogServicePublic}/product-category/get-available-category-in-stock/${id}`,
    {
      params,
    }
  );
};

export const useGetCategoryInStock = (enabled: boolean, id?: string) => {
  return useInfiniteQuery({
    queryKey: ['useGetCategoryInStockKey', id],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      return fetcher(
        {
          page: pageParam,
          size: 20,
        },
        id
      );
    },
    enabled: !!id && enabled,
    select: (data) => {
      const { pages } = data;
      const result: any[] = [];
      pages.forEach((item) => {
        item.content.forEach((user: any) => {
          result.push(user);
        });
      });
      return result.map((item) => {
        return {
          label: item.categoryName,
          value: item.id,
        };
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.number >= lastPage.totalPages - 1) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};
const fetcher1 = (params: IParamsRequest) => {
  return axiosClient.get<string, IPage<any>>(
    `${prefixCatalogService}/product-category`,
    {
      params,
    }
  );
};

export const useGetAllCategoryInStock = (
  enabled: boolean,
  params: IParamsRequest
) => {
  return useInfiniteQuery({
    queryKey: ['useGetAllCategoryInStockKey', params],
    initialPageParam: params.page,
    queryFn: ({ pageParam = 0 }) => {
      return fetcher1({
        ...params,
        page: pageParam,
      });
    },
    enabled: enabled,
    select: (data) => {
      const { pages } = data;
      const result: any[] = [];
      pages.forEach((item) => {
        item.content.forEach((user: any) => {
          result.push(user);
        });
      });
      return result.map((item) => {
        return {
          label: item.categoryName,
          value: item.id,
        };
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.number >= lastPage.totalPages - 1) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};
