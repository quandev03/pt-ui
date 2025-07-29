import { axiosClient } from 'apps/Internal/src/service';
import { IAssignPayload } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { IErrorResponse } from '@react/commons/types';

const assignApi = (data: IAssignPayload) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/assign-subdocument`,
    data
  );
};
export const useAssign = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_CENSORSHIP_LIST],
      });
      NotificationSuccess('Phân công kiểm duyệt thành công');
      onSuccess();
    },
    onError: (err: IErrorResponse) => {
      NotificationError(err.detail);
    },
  });
};
