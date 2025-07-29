import { NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListObject } from './useListObject';
import { prefixAuthServicePrivate } from 'apps/Internal/src/constants/app';

export interface Req {
  contractNo: string;
  signature: Blob;
}

interface Res {
  data: { contractId: string };
}
export const queryKeyObject = 'query-create-object';

const fetcher = (body: any) => {
  if (body.parentId === '') {
    delete body.parentId;
  }
  return axiosClient.post<any, Res>(`${prefixAuthServicePrivate}/api/objects`, body);
};

export const useCreateObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyObject],
    mutationFn: fetcher,
    onSuccess: () => {
      window.history.back();
      queryClient.invalidateQueries({
        queryKey: [queryKeyListObject],
      });
      NotificationSuccess(MESSAGE.G01);
    },
  });
};
