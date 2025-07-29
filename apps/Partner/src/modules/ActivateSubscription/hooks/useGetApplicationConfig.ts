import { prefixCustomerServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export interface Req {
  type: string;
}

export interface ItemConfig {
  code: string;
  dataType: null;
  id: number;
  name: string;
  status: string;
  type: string;
  value: string;
}

const fetcher = (type: string) => {
  return axiosClient.post<Req, ItemConfig[]>(
    `${prefixCustomerServicePublic}/get-application-config`,
    null,
    {
      params: {
        type,
      },
    }
  );
};

export const useGetApplicationConfig = (type: string) => {
  return useQuery({
    queryKey: ['get-application-config', type],
    queryFn: () => fetcher(type),
    enabled: !!type,
  });
};
