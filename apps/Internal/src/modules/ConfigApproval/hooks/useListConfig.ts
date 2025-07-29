import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ConfigApprovalType } from '../types';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';

export const queryKeyListConfig = 'query-list-config-approval';

const fetcher = (params: any) => {
  return axiosClient.get<any, IPage<ConfigApprovalType>>(
    `${prefixApprovalService}/approval-process`,
    { params }
  );
};

export const useListConfig = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyListConfig, body],
    select: (data: IPage<ConfigApprovalType>) => data,
    enabled: true,
  });
};
