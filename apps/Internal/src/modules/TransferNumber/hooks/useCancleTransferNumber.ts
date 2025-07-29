import { NotificationSuccess } from '@react/commons/Notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelTransferNumber } from '../services/service';
import { QUERY_KEY } from './key';

export const useCancelTransferNumber = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelTransferNumber,
    onSuccess: () => {
      NotificationSuccess('Hủy điều chuyển số thành công');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GET_STOCK_TRANSFER_NUMBER],
      });
      onSuccess && onSuccess();
    },
  });
};
