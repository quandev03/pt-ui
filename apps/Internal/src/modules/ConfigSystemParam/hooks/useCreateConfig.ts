import { NotificationError, NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListConfig } from './useListConfig';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface Req {
  contractNo: string;
  signature: Blob;
}

interface Res {
  data: { contractId: string };
}

const fetcher = (body: any) => {
  return axiosClient.post<any, Res>(
    `${prefixCustomerService}/application-config`,
    body
  );
};

export const useCreateConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListConfig],
      });
      NotificationSuccess(MESSAGE.G01);
    },
  });
};
