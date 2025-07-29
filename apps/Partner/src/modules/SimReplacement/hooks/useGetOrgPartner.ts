import { useQuery } from '@tanstack/react-query';
import { IOrgPartner } from '../types';
import { axiosClient } from 'apps/Partner/src/service';
import { prefixCatalogServicePublic } from '@react/url/app';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';

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
