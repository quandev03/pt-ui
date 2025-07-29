import { NotificationSuccess } from '@react/commons/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListObject } from './useListObject';
import { MESSAGE } from '@react/utils/message';
import { prefixAuthServicePrivate } from 'apps/Internal/src/constants/app';

export interface Req {
  id: string;
  payload: any;
}

interface Res {
  data: { contractId: string };
}
export const queryKeyObject = 'query-edit-object';

const fetcher = ({ id, payload }: Req) => {
  return axiosClient.put<Req, Res>(
    `${prefixAuthServicePrivate}/api/objects/${id}`,
    payload
  );
};

export const useEditObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyObject],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListObject],
      });
      NotificationSuccess(MESSAGE.G02);
      window.history.back();
    },
  });
};
