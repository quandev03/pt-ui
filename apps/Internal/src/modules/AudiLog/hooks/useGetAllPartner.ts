import { prefixCatalogServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export const useGetAllUserOptionKey = 'useGetAllUserOptionKey';

export interface IUser {
  id: number;
  parentId: number;
  orgCode: string;
  orgName: string;
  status: number;
  email: string;
}

const fetcher = () => {
  return axiosClient.get<IUser, IUser[]>(
    `${prefixCatalogServicePublic}/organization-partner/all-partner`
  );
};

export const useGetAllPartner = () => {
  return useQuery({
    queryFn: fetcher,
    queryKey: [useGetAllUserOptionKey],
    select(data) {
      return data.map((item) => ({
        label: item.orgName,
        value: item.orgCode,
      }));
    },
  });
};
