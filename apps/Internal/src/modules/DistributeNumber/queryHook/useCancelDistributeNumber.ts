import { NotificationSuccess } from '@react/commons/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCancelDistributeNumber } from '../services';

export const useCancelDistributeNumber = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCancelDistributeNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['useGetDistributeNumberKey'],
      });
      NotificationSuccess('Hủy phân phối số thành công !');
      onSuccess && onSuccess();
    },
  });
};
