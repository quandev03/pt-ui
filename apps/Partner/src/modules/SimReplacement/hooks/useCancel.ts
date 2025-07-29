import { NotificationSuccess } from '@react/commons/Notification';
import { prefixCustomerServicePublic } from '@react/url/app';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { axiosClient } from 'apps/Partner/src/service';

const cancelApi = (id: number) => {
  return axiosClient.put<any>(
    `${prefixCustomerServicePublic}/change-sim-bulk/cancel/${id}`
  );
};
export const useCancel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelApi,
    onSuccess: () => {
      NotificationSuccess("Hủy đổi SIM thành công");
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_SIM_REPLACEMENT_LIST],
      });
    },
  });
};
