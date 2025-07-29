import { prefixEventService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

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
  preValue: Record<string, any>;
  postValue: Record<string, any>;
}

const fetcher = (id: string) => {
  return axiosClient.get<string, IAuditItem>(
    `${prefixEventService}/audit-logs/${id}`
  );
};

export const useGetAuditLogDetail = (id: string) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [useGetAuditLogKey, id],
    enabled: !!id,
  });
};
