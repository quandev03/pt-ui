import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IErrorResponse } from '@react/commons/types';
import { prefixCustomerService } from '@react/url/app';
import { MESSAGE } from '@react/utils/message';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';

type Req = {
  id?: string;
  status: boolean;
};
const updateStatus = (data: Req) => {
  const stt = data.status ? 1 : 0;
  return axiosClient.put<any, any>(
    `${prefixCustomerService}/authorized-person/update-auth-person?id=${data.id}&status=${stt}`
  );
};
export const useEditRepStatus = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G02);
      navigate(-1);
    },
    onError: (err: IErrorResponse) => {
      NotificationError(err.detail);
    },
  });
};
