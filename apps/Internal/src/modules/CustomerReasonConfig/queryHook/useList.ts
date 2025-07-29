import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import {
  ContentItem,
  GetListResponse,
  IReasonParams,
  IReasonTypeRequestParams,
  ReasonTypeItem,
} from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  prefixCustomerService,
  prefixCustomerServicePublic,
} from '@react/url/app';

export const convertArrToObj = (arr: any[], parent: any) => {
  const newArr = arr
    ?.filter((item) => item.parentId === parent)
    ?.reduce((acc, item) => {
      acc.push({ ...item, children: convertArrToObj(arr, item.id) });
      return acc;
    }, []);

  return newArr?.length > 0 ? newArr : undefined;
};

type Response = {
  data: GetListResponse<ContentItem>;
};

const fetcher = async (params: IReasonParams) => {
  return await axiosClient.get<Response>(
    `${prefixCustomerService}/reason/search`,
    { params }
  );
};

export const useList = (params: IReasonParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_REASON_CUSTOMER, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
  });
};

type ReasonRespone = {
  data: GetListResponse<ReasonTypeItem>;
};

const fetcherReasonType = async () => {
  return await axiosClient.post<ReasonRespone>(
    `${prefixCustomerService}/get-application-config`, {
      params: {
        'type': 'REASON',
      },
    }
  );
};
export const useListReasonType = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_REASONS_TYPE],
    queryFn: () => fetcherReasonType(),
    select: (data: any) => data,
  });
};
