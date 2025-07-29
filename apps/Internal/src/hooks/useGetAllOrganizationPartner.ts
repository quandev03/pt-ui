import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCatalogServicePublic } from '../constants/app';

export const useGetAllOrganizationPartnerKey =
  'useGetAllOrganizationPartnerKey';

interface IOrganizationPartner {
  id: number;
  parentId: any;
  orgCode: string;
  orgName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: number;
}

const fetcher = (identityCode: string) => {
  return axiosClient.get<string, IOrganizationPartner[]>(
    `${prefixCatalogServicePublic}/organization-partner/get-unit-by-code/${identityCode}`
  );
};

export const useGetAllOrganizationPartner = (identityCode: string) => {
  return useQuery({
    queryFn: () => fetcher(identityCode),
    queryKey: [useGetAllOrganizationPartnerKey, identityCode],
    enabled: !!identityCode,
    select: (data = []) =>
      data.map((e) => ({
        value: e.id,
        label: e.orgName,
        parentId: e.parentId,
      })),
  });
};
