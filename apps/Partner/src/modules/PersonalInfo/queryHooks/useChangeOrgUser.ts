import { useMutation } from '@tanstack/react-query';
import { prefixCatalogServicePublic } from 'apps/Partner/src/constants/app';
import { axiosClient } from 'apps/Partner/src/service';

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
