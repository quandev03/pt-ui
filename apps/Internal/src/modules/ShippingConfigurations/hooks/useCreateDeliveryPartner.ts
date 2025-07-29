import { NotificationSuccess } from '@react/commons/Notification';
import { prefixSaleServicePrivate } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = (payload: { partner: string }) => {
  return axiosClient.put(
    `${prefixSaleServicePrivate}/delivery-partner/set-default`,
    null,
    {
      params: payload,
    }
  );
};
export const useCreateDeliveryPartner = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      onSuccess();
    },
  });
};
