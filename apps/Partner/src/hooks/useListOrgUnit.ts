import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { prefixCatalogServicePublic } from '../constants/app';

export type OrgUnitType = {
  id: number;
  parentId: 1;
  orgCode: string;
  orgName: string;
  status: number;
};

export const queryKeyListOrgUnit = 'list-organization-unit-of-thucnv';

type PayloadType = { status: number; 'org-type'?: string };

const fetcher = (params: PayloadType) => {
  return axiosClient.get<Request, OrgUnitType[]>(
    `${prefixCatalogServicePublic}/organization-unit`,
    { params: params }
  );
};

export const useListOrgUnit = (params: PayloadType) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [queryKeyListOrgUnit, params],
    select: (data) =>
      data?.map((e) => ({
        value: e.id,
        label: e.orgName,
      })),
  });
};
