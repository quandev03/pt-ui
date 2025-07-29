import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import {
  ContentItem,
  GetListResponse,
  IPromoParams,
  IReasonTypeRequestParams,
  ReasonTypeItem,
} from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  prefixCustomerService,
} from '@react/url/app';
import dayjs from 'dayjs';
import { formatDateV2 } from '@react/constants/moment';

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

const fetcher = async (params: IPromoParams) => {
  return await axiosClient.get<Response>(
    `${prefixCustomerService}/promotion/execute/search`,
    {
      params: {
        ...params,
        fromDate: params.fromDate ? params.fromDate : dayjs().subtract(29, 'day').startOf('day').format(formatDateV2),
        toDate: params.toDate ? params.toDate : dayjs().endOf('day').format(formatDateV2),
      }
    }
  );
};

export const useList = (params: IPromoParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PROMOTION_HISTORY, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
  });
};

type ReasonRespone = {
  data: GetListResponse<ReasonTypeItem>;
};

const fetcherPromotion = async (page: number, size: number) => {
  return await axiosClient.get<ReasonRespone>(
    `${prefixCustomerService}/promotion/search`,
    {
      params: {
        status: 0,
        page,
        size,
      },
    }
  );
};
export const useListPromotion = (page: number, size: number) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_ACTIVE_PROMOTION, page, size],
    queryFn: () => fetcherPromotion(page, size),
    select: (data: any) => data,
  });
};
