import { axiosClient } from 'apps/Partner/src/service';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { prefixCatalogServicePublic } from '@react/url/app';

const fetcher = async (id: string) => {
  return await axiosClient.get<any>(
    `${prefixCatalogServicePublic}/organization-unit/detail` + `/${id}`
  );
};

export const useView = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_VIEW_LIST_OF_DEPARTMENT, id],
    queryFn: () => fetcher(id),
    select: (data: any) => data,
    enabled: false,
  });
};
