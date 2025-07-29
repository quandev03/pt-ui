import { NotificationError } from '@react/commons/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { MESSAGE } from '@react/utils/message';
import { KitCraftType } from '../types';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';

export interface Req {
  process_code: number[];
  status: number[];
  status_last: number[];
  from_date: string;
  to_date: string;
  page: number;
  size: number;
}

interface Res {
  content: KitCraftType[];
  totalElements: number;
  size: number;
}

export const queryKeyListKitCraft = 'query-list-approval';

const fetcher = (params: any) => {
  return axiosClient.get<Req, Res>(`${prefixApprovalService}/approval`, {
    params,
  });
};

export const useListKitCraft = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyListKitCraft, body],
    select: (data: Res) => data,
    enabled: true,
  });
};
