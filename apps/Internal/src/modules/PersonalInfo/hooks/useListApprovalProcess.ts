import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export const queryKeyListApprovalProcess =
  'query-list-approval-process-personal';

export interface ApprovalProcessType {
  id: number;
  processName: string;
  orgId: number;
  stepOrder: number;
  userId: string;
  userName: string;
}
const fetcher = (id: string | undefined) => {
  return axiosClient.get<string | undefined, ApprovalProcessType[]>(
    `${prefixApprovalService}/approval-delegate?user-id=${id}`
  );
};

export const useListApprovalProcess = (id: string | undefined) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyListApprovalProcess, id],
    select: (data: ApprovalProcessType[]) => data,
    enabled: !!id,
  });
};
