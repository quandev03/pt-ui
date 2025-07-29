import { IPage, IParamsRequest } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixEventService } from '@react/url/app';

export const useGetAccessLogKey = 'useGetAccessLogKey';

export interface IAccessItem {
  id: string;
  actionType: string;
  accessTime: string;
  clientId: string;
  clientCode: string;
  clientName: string;
  userId: string;
  username: string;
  fullname: string;
  siteId: string;
  siteCode: string;
  siteName: string;
  status: number;
}

export interface IParamsAccessLog extends IParamsRequest {
  startTime?: string;
  endTime?: string;
  actionType?: string;
  userId?: string;
  actionTime?: string;
  username?: string;
  clientId?: string;
  clientCode?: string;
  siteId?: string;
  siteCode?: string;
}

const fetcher = (params: IParamsAccessLog) => {
  return axiosClient.get<IParamsAccessLog, IPage<IAccessItem>>(
    `${prefixEventService}/access-logs`,
    { params }
  );
};

export const useGetAccessLog = (params: IParamsAccessLog) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [useGetAccessLogKey, params],
    enabled: true,
  });
};
