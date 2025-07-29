import { NotificationSuccess } from '@react/commons/Notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = ({ id, status }: { id: number; status: number }) => {
  return axiosClient.put(
    `${prefixSaleService}/stock-move/${id}?status=${status}`
  );
};

export const useUpdateStatusEximDistributor = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; status: number }) => fetcher(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_EXIM_DISTRIBUTOR],
      });
      NotificationSuccess('Hủy giao dịch thành công');
      onSuccess && onSuccess()
    },
  });
};
