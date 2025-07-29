import { NotificationError } from '@react/commons/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { MESSAGE } from '@react/utils/message';
import { ApprovalType } from '../types';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';

export interface Req {
  processCode: number[];
  status: number[];
  statusLast: number[];
  from_date: string;
  to_date: string;
  page: number;
  size: number;
}

interface Res {
  content: ApprovalType[];
  totalElements: number;
  size: number;
}

export const queryKeyListApproval = 'query-list-approval';

const fetcher = (params: any) => {
  delete params.queryTime;
  return axiosClient.get<Req, Res>(`${prefixApprovalService}/approval`, {
    params,
  });
};

export const useListApproval = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyListApproval, body],
    select: (data: Res) => data,
    enabled: true,
  });
};
