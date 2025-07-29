import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCatalogService } from '../constants/app';

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
    `${prefixCatalogService}/organization-unit`,
    { params: params }
  );
};

export const useListOrgUnit = (params: PayloadType) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [queryKeyListOrgUnit, params],
    staleTime: Infinity,
    select: (data) =>
      data?.map((e) => ({
        value: e.id,
        label: e.orgName,
      })),
  });
};

export const useListOrgUnitNoOption = (params: PayloadType) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [queryKeyListOrgUnit, params],
  });
};
