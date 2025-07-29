import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import {
  ContentItem,
  GetListResponse,
  IReasonParams,
  ReasonTypeItem,
} from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

export const convertArrToObj = (arr: any[], parent: any) => {
  let newArr = arr
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
    `${prefixCatalogService}/reason/search`,
    { params }
  );
};

export const useList = (params: IReasonParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_REASONS, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
  });
};

type ReasonRespone = {
  data: GetListResponse<ReasonTypeItem>;
};

const fetcherReasonType = async () => {
  return await axiosClient.get<ReasonRespone>(
    `${prefixCatalogService}/reason-type`
  );
};
export const useListReasonType = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_REASONS_TYPE],
    queryFn: () => fetcherReasonType(),
    select: (data: any) => data,
  });
};
