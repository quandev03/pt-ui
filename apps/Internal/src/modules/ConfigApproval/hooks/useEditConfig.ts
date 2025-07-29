import { NotificationError, NotificationSuccess } from '@react/commons/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListConfig } from './useListConfig';
import { MESSAGE } from '@react/utils/message';
import { prefixApprovalService } from 'apps/Internal/src/constants/app';

export interface Req {
  id: string;
  payload: any;
}

interface Res {
  data: { contractId: string };
}
export const queryKeyConfig = 'query-edit-config-approval';

const fetcher = ({ id, payload }: Req) => {
  return axiosClient.put<Req, Res>(
    `${prefixApprovalService}/approval-process/${id}`,
    payload
  );
};

export const useEditConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyConfig],
    mutationFn: fetcher,
    onSuccess: () => {
      window.history.back();
      queryClient.invalidateQueries({
        queryKey: [queryKeyListConfig],
      });
      NotificationSuccess(MESSAGE.G02);
    },
  });
};
