import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MESSAGE, NotificationSuccess } from '@vissoft-react/common';
import { prefixAuthService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';
import { queryKeyListObject } from '../pages/useListObject';

export interface Req {
  id: string;
  payload: any;
}

export const queryKeyObject = 'query-edit-object';

const fetcher = ({ id, payload }: Req) => {
  return safeApiClient.put<Req>(
    `${prefixAuthService}/api/objects/${id}`,
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
