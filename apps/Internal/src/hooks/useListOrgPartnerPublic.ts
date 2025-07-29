import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCatalogServicePublic } from '@react/url/app';
import { IPage, IParamsRequest } from '@react/commons/types';

export type OrgUnitType = {
  id: number;
  parentId: 1;
  orgCode: string;
  orgName: string;
  status: number;
};

type PayloadType = IParamsRequest & {
  partnerType?: string;
  approvalStatus?: number;
};

export const ListOrgUnitPublicKey = 'ListOrgUnitPublicKey';

const fetcher = (payload: PayloadType) => {
  return axiosClient.get<Request, IPage<OrgUnitType>>(
    `${prefixCatalogServicePublic}/organization-partner`,
    { params: payload }
  );
};

export const useListOrgPartnerPublic = (payload: PayloadType) => {
  return useQuery({
    queryFn: () => fetcher(payload),
    queryKey: [ListOrgUnitPublicKey, payload],
    select: (data): { label: string; value: string | number }[] =>
      data?.content.map((e) => ({
        value: e.id,
        label: e.orgName,
      })),
  });
};
