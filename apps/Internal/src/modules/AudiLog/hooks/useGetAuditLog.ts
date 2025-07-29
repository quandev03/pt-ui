import { IPage, IParamsRequest } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixEventService } from '@react/url/app';

export const useGetAuditLogKey = 'useGetAuditLogKey';
export interface IAuditItem {
  id: string;
  subSystem: string;
  actionType: string;
  actionName: string;
  actionTime: string;
  clientId: string;
  clientCode: string;
  clientName: string;
  userId: string;
  username: string;
  fullname: string;
  targetType: string;
  targetName: string;
  status: number;
  siteName: string;
  siteCode: string;
}

export interface IParamsAuditLog extends IParamsRequest {
  startTime?: string;
  endTime?: string;
  subSystem?: string;
  actionType?: string;
  actionTime?: string;
  userId?: string;
  username?: string;
  clientId?: string;
  clientCode?: string;
}

const fetcher = (params: IParamsAuditLog) => {
  return axiosClient.get<IParamsAuditLog, IPage<IAuditItem>>(
    `${prefixEventService}/audit-logs`,
    { params }
  );
};

export const useGetAuditLog = (params: IParamsAuditLog) => {
  return useQuery({
    queryFn: () => fetcher(params),
    queryKey: [useGetAuditLogKey, params],
    enabled: !!params.startTime && !!params.endTime,
  });
};
