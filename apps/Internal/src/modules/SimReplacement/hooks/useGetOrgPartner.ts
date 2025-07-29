import { useQuery } from '@tanstack/react-query';
import { prefixCatalogServicePublic } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IOrgPartner } from '../types';

const fetcher = () => {
  return axiosClient.get<any, IOrgPartner[]>(
    `${prefixCatalogServicePublic}/organization-partner/all-partner`
  );
};
export const useGetOrgPartner = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ORGNIZATION_PARTNER],
    queryFn: fetcher,
  });
};
