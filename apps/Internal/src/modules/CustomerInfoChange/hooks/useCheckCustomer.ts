import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { NotificationError } from '@react/commons/Notification';
import useActiveSubscriptStore from '../store';

export interface Req {
  isdn: string;
  id: string;
}

interface Res {
  data: any;
}

export const queryKeyActivateInfo = 'query-change-information-check';

const fetcher = (data: Req) => {
  return axiosClient.post<Req, Res>(
    `${prefixCustomerService}/change-information/check-old-info`,
    data
  );
};

export const useCheckCustomer = () => {
  const { formAntd, resetGroupStore, setSuccessIsdn } =
    useActiveSubscriptStore();
  return useMutation({
    mutationKey: [queryKeyActivateInfo],
    mutationFn: fetcher,
    onSuccess: (data: any, variables) => {
      console.log('jhjhjhdf ', variables);
    },
    onError: (err: any) => {
      NotificationError(err?.detail);
      const phone = formAntd.getFieldValue('phone');
      formAntd.resetFields();
      resetGroupStore();
      setSuccessIsdn(true);
      formAntd.setFieldValue('phone', phone);
    },
  });
};
