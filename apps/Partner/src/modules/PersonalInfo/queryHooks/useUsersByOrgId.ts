import { useMutation } from '@tanstack/react-query';
import { prefixCatalogServicePublic } from 'apps/Partner/src/constants/app';
import { axiosClient } from 'apps/Partner/src/service';

export const queryKeyUsersByOrgId = 'query-users-by-org-id';

export interface UserInfoType {
  id: number;
  orgId: number;
  userId: string;
  userName: string;
  userFullName: string;
}

const fetcher = (orgId: number) => {
  return axiosClient
    .get<number, UserInfoType[]>(
      `${prefixCatalogServicePublic}/organization-user?org_id=${orgId}`
    )
    .then((data) =>
      data?.map((e) => ({
        value: e.userId,
        label: e.userName,
        userFullName: e.userFullName,
      }))
    );
};

export const useUsersByOrgId = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
