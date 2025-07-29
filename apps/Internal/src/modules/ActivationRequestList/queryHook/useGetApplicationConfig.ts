import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

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
    `/customer-service/private/api/v1/get-application-config`,
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
