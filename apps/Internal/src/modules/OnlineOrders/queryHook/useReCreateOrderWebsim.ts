import { AnyElement } from '@react/commons/types';
import { prefixSaleServicePrivate } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ICoverageAreaItem } from '../../GeographicCoverageManagement/types';
import { NotificationError, NotificationSuccess } from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetch = async (id: string) => {
  return await axiosClient.post<string, ICoverageAreaItem>(
    `${prefixSaleServicePrivate}/sale-orders/online-order/re-create-order/${id}`
  );
};

export const useReCreateOrderWebsim = (
  onSuccess?: (data: AnyElement) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      onSuccess && onSuccess(data);
      NotificationSuccess('Tạo lại đơn thành công');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_ONLINE_ORDER],
      });
    },
    onError: () => {
      NotificationError('Tạo lại đơn thất bại');
    },
  });
};
