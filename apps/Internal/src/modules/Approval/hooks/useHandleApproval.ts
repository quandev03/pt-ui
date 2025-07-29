import { NotificationError, NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListApproval } from './useListApproval';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';

export interface Req {
  id: number;
  status: number;
  message: string;
}
interface Res {
  data: { contractId: string };
}
export const queryKeyApproval = 'query-handle-approval';

const fetcher = (body: any) => {
  return axiosClient.post<any, Res>(`${prefixApprovalService}/approval`, body);
};

export const useHandleApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyApproval],
    mutationFn: fetcher,
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListApproval],
      });
      NotificationSuccess(status ? MESSAGE.G08 : MESSAGE.G09);
    },
  });
};
