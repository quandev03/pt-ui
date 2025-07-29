import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { prefixCatalogServicePublic } from '../constants/app';

export const queryKeyGetOrgUnitByUser = 'query-get-org-unit-by-user';

export interface OrgUnitType {
  orgId: number;
  orgName: string;
  isCurrent: boolean;
  orgCode: string;
}

const fetcher = () => {
  return axiosClient.get<undefined, OrgUnitType[]>(
    `${prefixCatalogServicePublic}/organization-user/get-all-organization-by-user`
  );
};

export const useGetOrgByUser = () => {
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: [queryKeyGetOrgUnitByUser],
    select: (data = []) =>
      data.map((e) => ({
        ...e,
        value: e.orgId,
        label: e.orgName,
      })),
  });
};
