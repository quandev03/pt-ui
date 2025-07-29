import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import {
  ContentItem,
  GetListResponse,
  IAreaParams,
} from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

type Response = {
  data: GetListResponse<ContentItem>;
};

const fetcher = async (params: IAreaParams) => {
  return await axiosClient.get<Response>(
    `${prefixCatalogService}/area/search`,
    { params }
  );
};

export const useList = (params: IAreaParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_WARD, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
    enabled: !!params.isCall,
  });
};
