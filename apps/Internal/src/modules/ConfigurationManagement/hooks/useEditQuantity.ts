import { NotificationSuccess } from '@react/commons/Notification';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

const editQuantityApi = (data: { id: number; value: string }) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/application-config/set-value-config?id=${data.id}&value=${data.value}`
  );
};
export const useEditQuantity = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editQuantityApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ACTIVATION_CONFIG_LIST],
      });
      NotificationSuccess('Cập nhật thành công');
      onSuccess();
    },
  });
};
