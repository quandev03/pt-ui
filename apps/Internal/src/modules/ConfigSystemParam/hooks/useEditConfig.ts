import { NotificationError, NotificationSuccess } from '@react/commons/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListConfig } from './useListConfig';
import { MESSAGE } from '@react/utils/message';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface Req {
  id: string;
  payload: any;
}

interface Res {
  data: { contractId: string };
}

const fetcher = ({ id, payload }: Req) => {
  return axiosClient.put<Req, Res>(
    `${prefixCustomerService}/application-config/${id}`,
    payload
  );
};

export const useEditConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      window.history.back();
      queryClient.invalidateQueries({
        queryKey: [queryKeyListConfig],
      });
    },
  });
};
