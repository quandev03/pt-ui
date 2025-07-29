import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { FormInstance } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface ItemCancel {
  saveForm: boolean;
  listIds: [];
}

const cancelApi = (data: ItemCancel) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/subscriber-request/cancel-request`,
    data
  );
};

export const useCancelFn = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_REQUEST_LIST],
      });
      NotificationSuccess('Hủy yêu cầu kích hoạt thành công');

      form.resetFields();
    },
    onError: (err) => {
      if (err?.message) {
        NotificationError(err?.message);
      }
    },
  });
};
