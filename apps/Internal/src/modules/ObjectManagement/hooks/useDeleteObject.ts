import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MESSAGE, NotificationSuccess } from '@vissoft-react/common';
import { prefixAuthService } from 'apps/Internal/src/constants';
import { safeApiClient } from 'apps/Internal/src/services';
import { queryKeyListObject } from '../pages/useListObject';

interface Req {
  id: string | undefined;
  isPartner: boolean;
  isMobile?: boolean;
}

const fetcher = ({ id, isPartner, isMobile }: Req) => {
  const url = `${prefixAuthService}/api/objects/${id}?isPartner=${isPartner}${
    isMobile ? '&isMobile=true' : ''
  }`;
  return safeApiClient.delete(url);
};

export const useDeleteObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListObject],
      });
      NotificationSuccess(MESSAGE.G03);
    },
  });
};
