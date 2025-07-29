import { NotificationSuccess } from '@react/commons/Notification';
import { prefixSaleServicePrivate } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetch = async (params: { id: number; email: string }) => {
  const res = await axiosClient.post<any>(
    `${prefixSaleServicePrivate}/sale-orders/online-order/send-esim-qr?id=${params.id}&email=${params.email}`
  );
  return res;
};
export const useSendQrCode = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetch,
    onSuccess: () => {
      onSuccess && onSuccess();
      NotificationSuccess('Gửi QR eSIM thành công!');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_ONLINE_ORDER],
      });
    },
  });
};
