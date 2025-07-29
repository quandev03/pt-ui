import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ConfigSystemParamType } from '../types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export const queryKeyListConfig = 'query-list-config-system-param';

const fetcher = (param: string) => {
  return axiosClient.get<any, IPage<ConfigSystemParamType>>(
    `${prefixCustomerService}/application-config/search`,
    { params: param }
  );
};

export const useListConfig = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyListConfig, body],
    select: (data: IPage<ConfigSystemParamType>) => data,
    enabled: true,
  });
};
