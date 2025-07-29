import { NotificationSuccess } from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListObject } from './useListObject';
import { prefixAuthServicePrivate } from 'apps/Internal/src/constants/app';

interface Req {
  id: string | undefined;
  isPartner: boolean;
  isMobile?: boolean;
}

const fetcher = ({ id, isPartner, isMobile }: Req) => {
  const url = `${prefixAuthServicePrivate}/api/objects/${id}?isPartner=${isPartner}${
    isMobile ? '&isMobile=true' : ''
  }`;
  return axiosClient.delete(url);
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
