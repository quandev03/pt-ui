import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from '../constants/app';

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
    `${prefixCustomerService}/get-application-config`,
    null,
    {
      params: {
        type,
      },
    }
  );
};

export const useGetApplicationConfig = (type: string, enabled = true) => {
  return useQuery({
    queryKey: ['get-application-config', type],
    queryFn: () => fetcher(type),
    staleTime: Infinity,
    enabled: !!type && enabled,
  });
};
