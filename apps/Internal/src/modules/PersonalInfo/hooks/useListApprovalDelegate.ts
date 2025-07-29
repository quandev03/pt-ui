import { IPage } from '@react/commons/types';
import { getDate, getDayjs } from '@react/utils/datetime';
import { useQuery } from '@tanstack/react-query';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';

export const queryKeyListApprovalDelegate =
  'query-list-approval-delegate-personal';

export interface ApprovalDelegateType {
  id: string;
  delegateUserId: string;
  delegateUserName: string;
  fromDate: string;
  toDate: string;
  email: string;
}
interface ApprovalStepDelegate {
  processName: string;
  approvalStepDelegates: ApprovalDelegateType[];
}
const fetcher = (id: number | undefined) => {
  return axiosClient.get<string, ApprovalStepDelegate[]>(
    `${prefixApprovalService}/approval-delegate/${id}`
  );
};

export const useListApprovalDelegate = (
  id: number | undefined,
  isOpen: boolean
) => {
  return useQuery({
    queryFn: () => fetcher(id),
    queryKey: [queryKeyListApprovalDelegate, id, isOpen],
    select: (data) => {
      if (!data?.length) {
        return { processName: '', delegates: [] };
      }

      const firstProcess = data[0];
      return {
        processName: firstProcess.processName,
        delegates: data.map((process) => {
          const delegate = process.approvalStepDelegates[0] || {};
          return {
            ...delegate,
            fromDate: getDayjs(delegate.fromDate),
            toDate: getDayjs(delegate.toDate),
          };
        }),
      };
    },
    enabled: !!id && isOpen,
  });
};
