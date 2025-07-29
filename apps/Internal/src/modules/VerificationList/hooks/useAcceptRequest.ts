import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IErrorResponse } from '@react/commons/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';

const acceptReqApi = (id: string) => {
  return axiosClient.put<any>(
    `${prefixCustomerService}/approve-subdocument/${id}`
  );
};
export const useAcceptRequest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: acceptReqApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_CENSORSHIP_LIST_FOR_STAFF],
      });
      NotificationSuccess('Kiểm duyệt hồ sơ thành công');
      navigate(-1);
    },
    onError: (err: IErrorResponse) => {
      NotificationError(err.detail);
    },
  });
};
