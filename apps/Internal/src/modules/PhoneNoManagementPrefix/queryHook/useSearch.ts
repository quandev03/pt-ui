import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ContentItem, GetListResponse } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { IParamsRequest } from '@react/commons/types';
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

const fetcher = async (prfix: string) => {
  // const paramCustom = {
  //     "search-string": params.q ?? "",
  //     page: params.page ?? "",
  //     size: params.size ?? ""
  //   }
  return await axiosClient.get<any, Response>(
    `${prefixCatalogService}/isdn-prefix`,
    {
      params: {
        prefix: prfix,
      },
    }
  );
};

export const useSearch = (prfix: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PHONE_NO_PREFIX, prfix],
    queryFn: () => fetcher(prfix),
    select: (data: any) => data,
    enabled: !!prfix,
  });
};
