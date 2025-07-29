import {  IParamsRequest } from '@react/commons/types';
import { prefixCatalogServicePublic } from '@react/url/app';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CategoryTypes, IProduct } from '../types';
import { axiosClient } from 'apps/Partner/src/service';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';

const fetcher = (params: IParamsRequest) => {
  const customParams = {
    ...params,
    categoryTypes: [CategoryTypes.PHYSICAL_SIM, CategoryTypes.ESIM, CategoryTypes.KIT],
  };
  return axiosClient.get<IProduct[], any>(
    `${prefixCatalogServicePublic}/product/search-authorized-products-of-org`,
    { params: customParams, paramsSerializer: (params) => {
      const query = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          value.forEach((val) => query.append(key, val));
        } else {
          query.append(key, value);
        }
      });
      return query.toString();
    }}
  );
};


export const useInfinityScrollProducts = (params: IParamsRequest) => {
  return useInfiniteQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PRODUCTS, params],
    initialPageParam: params.page,
    queryFn: ({ pageParam = 0 }) => {
      return fetcher({
        page: pageParam,
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
