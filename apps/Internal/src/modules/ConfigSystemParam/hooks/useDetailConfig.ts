import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ConfigSystemParamType } from '../types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export const queryKeyDetailConfig = 'query-detail-config-approval';

const fetcher = (id: string | undefined) => {
  return axiosClient.get<string, ConfigSystemParamType>(
    `${prefixCustomerService}/application-config/${id}`
  );
};

export const useDetailConfig = (id: string | undefined) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyDetailConfig, id],
    select: (data: ConfigSystemParamType) => data,
    enabled: !!id,
  });
};
