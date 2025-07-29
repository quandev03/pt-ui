import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { EmailRequest } from '../types';
import { prefixCustomerService } from '@react/url/app';
import { NotificationSuccess } from '@react/commons/Notification';

const fetcher = (params: EmailRequest) => {
  return axiosClient.post<EmailRequest, Response>(
    `${prefixCustomerService}/search-request/send-email`,
    params
  );
};

export const useEmailMutation = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => NotificationSuccess('Gửi email thành công'),
  });
};
