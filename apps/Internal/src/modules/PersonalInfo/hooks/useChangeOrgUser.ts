import { prefixCatalogServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

interface Res {
  data: { contractId: string };
}
export const queryKeyOrgUser = 'query-change-organization-of-personal';

const fetcher = (id: string) => {
  return axiosClient.put<string, Res>(
    `${prefixCatalogServicePublic}/organization-user/change-stock`,
    {
      id: id ? id : null,
    }
  );
};

export const useChangeOrgUser = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
