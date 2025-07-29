import { NotificationError, NotificationSuccess } from '@react/commons/index';
import { useMutation } from '@tanstack/react-query';
import { prefixApprovalPublic } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface Req {
  id?: number;
  objectName?: string;
  recordId?: number;
}
interface Res {
  data: { contractId: string };
}
export const queryKeyProcessApproval = 'query-view-process-approval-by-id';

const fetcher = (body: any) => {
  return axiosClient.post<any, Res>(
    `${prefixApprovalPublic}/approval/approval-process-step`,
    body
  );
};

export const useViewProcess = () => {
  return useMutation({
    mutationKey: [queryKeyProcessApproval],
    mutationFn: fetcher,
  });
};
