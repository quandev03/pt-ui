import { useQuery } from '@tanstack/react-query';
import { ContentItem, GetListResponse, ICatalogSaleAMRequest, IUserRequestParams } from '../types';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  prefixCatalogService,
  prefixCustomerService,
} from 'apps/Internal/src/constants/app';

export const deleteChild = (savedArray: any[], id: any) => {
  if (!id || !savedArray) return savedArray;

  function removeByIds(arr: any[], parentIdsToBeRemoved: any[]) {
    // if there is no parentIdsToBeRemoved return whole array
    if (!parentIdsToBeRemoved || parentIdsToBeRemoved.length === 0) {
      return arr;
    }
    const tempIdsToBeRemoved: any[] = [];
    const newArr = arr.filter((item, index) => {
      if (
        parentIdsToBeRemoved.indexOf(item.parentId) > -1 ||
        parentIdsToBeRemoved.indexOf(item.id) > -1
      ) {
        tempIdsToBeRemoved.push(item.id);
      } else {
        return item;
      }
    });
    return removeByIds(newArr, tempIdsToBeRemoved);
  }

  return removeByIds(savedArray, [id]);
};

export const convertArrToObj = (arr: any[], parent: any) => {
  const newArr = arr
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

const fetcher = async (params: IUserRequestParams) => {
  return await axiosClient.get<Response>(
    `${prefixCustomerService}/sale-employee/get-list`,
    {params}
  );
};

export const useStaffList = (params: IUserRequestParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_USERS, params],
    queryFn: () => fetcher(params),
    select: (data: any) => data,
  });
};
