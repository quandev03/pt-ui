import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../service';
import {
  prefixCatalogService,
  prefixCatalogServicePublic,
} from '@react/url/app';

export type Cadastral = {
  id: number;
  orgId: number;
  orgCode: string;
  orgName: string;
};
export const useGetAllPartnerKey = 'useGetAllPartnerKey';
const fetcher = () => {
  return axiosClient.get<string, Cadastral[]>(
    `${prefixCatalogServicePublic}/organization-partner/all-partner`
  );
};

export const useGetAllPartner = () => {
  return useQuery({
    queryKey: [useGetAllPartnerKey],
    queryFn: () => fetcher(),
    select: (data) =>
      data?.map((e) => ({
        value: e.id,
        label: e.orgName,
      })),
  });
};
