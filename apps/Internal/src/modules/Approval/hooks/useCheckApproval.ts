import { useMutation, useQuery } from '@tanstack/react-query';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface Req {
  objectName: string;
  recordId: number;
}

export const queryKeyCheckApproval = 'query-check-button-approval';
const fetcher = (body: Req) => {
  return axiosClient.post<Req, any>(
    `${prefixApprovalService}/approval/check-button-approval`,
    body
  );
};

export const useCheckApproval = (body: any) => {
  return useQuery({
    queryFn: () => fetcher(body),
    queryKey: [queryKeyCheckApproval, body],
    select: (data: any) => data,
    enabled: !!body.objectName && !!body.recordId,
  });
};
