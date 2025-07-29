import { prefixApprovalServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export interface Req {
  id: number;
  objectName?: string;
  recordId?: number;
}
interface Res {
  data: { contractId: string };
}
export const queryKeyProcessKitCraft = 'query-view-process-approval-by-id';

const fetcher = (body: any) => {
  return axiosClient.post<any, Res>(
    `${prefixApprovalServicePublic}/approval/approval-process-step`,
    body
  );
};

export const useViewProcess = () => {
  return useMutation({
    mutationKey: [queryKeyProcessKitCraft],
    mutationFn: fetcher,
  });
};
