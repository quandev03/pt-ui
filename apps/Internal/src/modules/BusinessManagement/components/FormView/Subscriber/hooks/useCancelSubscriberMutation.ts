import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from '@react/url/app';
import { NotificationSuccess } from '@react/commons/Notification';
import { FormInstance } from 'antd';
import { CommonError } from '@react/commons/types';
import { mapApiErrorToForm } from '@react/helpers/utils';
import { CancelSubscriberRequest } from 'apps/Internal/src/modules/SearchSubscription/types';

const fetcher = (params: CancelSubscriberRequest) => {
  const formData = new FormData();
  const data = JSON.stringify(params.data);
  formData.append('data', data);
  formData.append('confirmationLetter', params.confirmationLetter);

  return axiosClient.post<CancelSubscriberRequest, Response>(
    `${prefixCustomerService}/del-subscriber`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export const useCancelSubscriberMutation = (form: FormInstance) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GET_LIST_SUBSCRIBER_ENTERPRISE'],
      });
      queryClient.invalidateQueries({
        queryKey: ['GET_DETAIL_SUBSCRIBER_ENTERPRISE'],
      });
      NotificationSuccess('Hủy thuê bao thành công');
    },
    onError: (error: CommonError) => mapApiErrorToForm(form, error.errors),
  });
};
