import { prefixCatalogServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
interface IOrganization {
  orgId: string;
  orgName: string;
  isCurrent: boolean;
  orgCode: string;
}
const fetcher = async () => {
  const res = await axiosClient.get<string, IOrganization[]>(
    `${prefixCatalogServicePublic}/organization-user/get-all-organization-by-user`
  );
  return res;
};
export const useGetStatusOrder = () => {
  return useQuery({
    queryKey: ['useGetStatusOrder'],
    queryFn: fetcher,
  });
};
