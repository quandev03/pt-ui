import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ContentItem, GetListResponse, IProfileParams } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

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

const fetcher = async (params: IProfileParams) => {
  return await axiosClient.get<Response>(
    `${prefixCatalogService}/profile/search`,
    { params }
  );
};

export const useList = (params: IProfileParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_PROFILES, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
  });
};
