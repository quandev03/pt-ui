import { useQuery } from '@tanstack/react-query';
import { prefixCatalogService } from '@react/url/app';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { axiosClient } from 'apps/Partner/src/service';
import { ContentItem } from '../types';
import { prefixCatalogServicePublic } from 'apps/Partner/src/constants/app';

export const deleteChild = (savedArray: any[], id: any) => {
  if (!id || !savedArray) return savedArray;

  function removeByIds(arr: any[], parentIdsToBeRemoved: any[]) {
    // if there is no parentIdsToBeRemoved return whole array
    if (!parentIdsToBeRemoved || parentIdsToBeRemoved.length == 0) {
      return arr;
    }
    const tempIdsToBeRemoved: string[] = [];
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

const fetcher = async () => {
  return await axiosClient.get<null, ContentItem[]>(
    `${prefixCatalogServicePublic}/organization-unit`
  );
};

export const useList = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_DEPARTMENT],
    queryFn: () => fetcher(),
    select: (data: any) => data,
  });
};
