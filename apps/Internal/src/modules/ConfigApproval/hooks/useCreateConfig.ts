import { NotificationError, NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListConfig } from './useListConfig';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';

export interface Req {
  contractNo: string;
  signature: Blob;
}

interface Res {
  data: { contractId: string };
}
export const queryKeyConfig = 'query-create-config-approval';

const fetcher = (body: any) => {
  return axiosClient.post<any, Res>(
    `${prefixApprovalService}/approval-process`,
    body
  );
};

export const useCreateConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyConfig],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListConfig],
      });
      NotificationSuccess(MESSAGE.G01);
    },
  });
};
