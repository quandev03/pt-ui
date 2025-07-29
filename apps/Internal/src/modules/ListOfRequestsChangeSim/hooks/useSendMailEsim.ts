import { prefixCustomerService } from '@react/url/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { NotificationSuccess } from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

export interface ParamSendMailEsim {
  requestId: string;
  email: string;
}

const fetcher = (data: ParamSendMailEsim) => {
  return axiosClient.post<any, any>(
    `${prefixCustomerService}/change-sim/send-mail`,
    data
  );
};
export const useSendMailEsim = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_POST_CHECK_LIST],
      });
      NotificationSuccess('Gửi email thành công');
      onSuccess && onSuccess();
    },
  });
};
