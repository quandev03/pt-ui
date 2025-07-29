import { useQuery } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface ItemConfig {
  code: string;
  dataType: null;
  id: number;
  name: string;
  status: number;
  type: string;
  value: string;
}

const fetcher = (params: any) => {
  return axiosClient.post<any, ItemConfig[]>(
    `${prefixCustomerService}/get-application-config`,
    null,
    {
      params,
    }
  );
};

export const useGetApplicationConfig = (params: any) => {
  return useQuery({
    queryKey: ['get-application-config', params],
    queryFn: () => fetcher(params),
  });
};
