import { useQuery } from '@tanstack/react-query';
import { ContentItem, GetListResponse, ICatalogSaleAMRequest } from '../types';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  prefixCatalogService,
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';

export const replaceChildren = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((item: any) => replaceChildren(item));
  }

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data.children) && data.children.length === 0) {
      data.children = null;
    }

    if (Array.isArray(data.children)) {
      data.children = replaceChildren(data.children);
    }

    return data;
  }

  return data;
};

export const replaceAM = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((item: any) => replaceAM(item));
  }

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data.children)) {
      data.children = null;
    }

    if (Array.isArray(data.children)) {
      data.children = replaceAM(data.children);
    }

    return data;
  }

  return data;
}

type Response = {
  data: GetListResponse<ContentItem>;
};

const fetcher = async (params: ICatalogSaleAMRequest) => {
  return await axiosClient.get<Response>(
    `${prefixCustomerService}/sale-employee/search`,
    {params: {
      ...params, 
      page: 0,
      size: 1000
    }}
  );
};

export const useList = (params: ICatalogSaleAMRequest) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_SALE_AND_AM, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
  });
};
