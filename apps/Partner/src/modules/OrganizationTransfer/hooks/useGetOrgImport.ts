import { prefixCatalogServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { IWarehouse, ModalStatus } from '../types';
const queryKey = 'get-org-import';
const fetcher = async (getAll: boolean) => {
  const url = getAll
    ? `${prefixCatalogServicePublic}/organization-unit`
    : `${prefixCatalogServicePublic}/organization-unit?status=${ModalStatus.ACTIVE}`;
  const res = await axiosClient.get<any, IWarehouse[]>(url);
  return res;
};
export const useGetOrgImport = (getAll: boolean) => {
  return useQuery({
    queryKey: [queryKey, getAll],
    queryFn: () => fetcher(getAll),
  });
};
