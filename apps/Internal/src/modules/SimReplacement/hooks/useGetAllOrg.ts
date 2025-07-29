import { useQuery } from '@tanstack/react-query';
import { prefixCatalogServicePublic } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = async () => {
  const res = await axiosClient.get<any, any>(
    `${prefixCatalogServicePublic}/organization-user/get-all-organization-by-user`
  );
  return res;
};
export const useGetAllOrg = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_ORGANIZATION],
    queryFn: fetcher,
  });
};
