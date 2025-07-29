import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreBusinessManagement from '../store';
import { NotificationSuccess } from '@react/commons/Notification';

export interface ParamVerifyData {
  id: string;
  name: string;
  birthday: string;
  document: string;
  id_ekyc: string;
}

const fetcher = (data: ParamVerifyData) => {
  return axiosClient.post<any, any>(
    `${prefixCustomerService}/enterprise/check-c06-info`,
    data
  );
};
export const useVerifyDataC06 = () => {
  const { formAntd } = useStoreBusinessManagement();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      NotificationSuccess(res.c06SuccessMessage);
      formAntd.setFieldsValue({
        isDisableButtonCheck: true,
      });
    },
  });
};
