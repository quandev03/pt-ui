import { NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation } from '@tanstack/react-query';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

interface Res {
  data: { contractId: string };
}
export const queryKeyApprovalDelegate = 'query-edit-approval-process-personal';

const fetcher = (payload: any) => {
  return axiosClient.post<any, Res>(
    `${prefixApprovalService}/approval-delegate`,
    payload
  );
};

export const useEditApprovalDelegate = () => {
  return useMutation({
    mutationKey: [queryKeyApprovalDelegate],
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
    },
  });
};
