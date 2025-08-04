import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnyElement,
  MESSAGE,
  NotificationSuccess,
} from '@vissoft-react/common';
import { safeApiClient } from 'apps/Internal/src/services';
import { queryKeyListObject } from '../pages/useListObject';
import { prefixAuthService } from 'apps/Internal/src/constants';

export interface Req {
  contractNo: string;
  signature: Blob;
}

interface Res {
  data: { contractId: string };
}
export const queryKeyObject = 'query-create-object';

const fetcher = (body: AnyElement) => {
  if (body.parentId === '') {
    delete body.parentId;
  }
  return safeApiClient.post<AnyElement>(
    `${prefixAuthService}/api/objects`,
    body
  );
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
