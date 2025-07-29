import { useQuery } from '@tanstack/react-query';
import { ContentItem, GetListResponse, IActiveApproveParams } from '../types';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export const convertArrToObj = (arr: any[], parent: any) => {
  let newArr = arr
    ?.filter(
      (item) =>
        item.parentId === parent ||
        (!arr?.some((val: any) => val.id === item.parentId) && parent === null)
    )
    ?.reduce((acc, item) => {
      acc.push({ ...item, children: convertArrToObj(arr, item.id) });
      return acc;
    }, []);

  return newArr?.length > 0 ? newArr : undefined;
};

type Response = {
  data: GetListResponse<ContentItem>;
};

const fetcher = async (params: IActiveApproveParams) => {
  const custParams = {
    ...params,
    size: 10000,
    page: 0,
  };
  return await axiosClient.get<Response>(
    `${prefixCustomerService}/subscriber-request/find-approve-check`,
    { params: custParams }
  );
};

export const useList = (params: IActiveApproveParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_APPROVE_LIST, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
    enabled: !!params.type
  });
};
