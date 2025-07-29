import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { FormInstance } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface ItemReject {
  saveForm: boolean;
  reasonReject: string;
  id: number;
}

const rejectApi = (data: ItemReject) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/subscriber-request/refuse-request`,
    data
  );
};

export const useRejectFn = (form: FormInstance<any>,
  onSuccess: (data: any) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_ACTIVE_APPROVE_LIST],
      });
      onSuccess(data)
    },
    onError: (err) => {
      if (err?.message) {
        NotificationError(err?.message);
      }
    },
  });
};
