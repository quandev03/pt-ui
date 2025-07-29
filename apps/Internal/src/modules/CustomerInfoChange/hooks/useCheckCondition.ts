import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { CommonError } from '@react/commons/types';
import { groupBy } from 'lodash';
import { NotificationSuccess } from '@react/commons/Notification';

export interface ParamCheckCondition {
  address: string;
  birthday: string;
  city: string;
  district: string;
  document: string;
  expiry: string;
  id: string;
  id_ekyc: string;
  issue_by: string;
  issue_date: string;
  name: string;
  sex: string;
  ward: string;
}

const fetcher = (body: ParamCheckCondition) => {
  return axiosClient.post<ParamCheckCondition, any>(
    `${prefixCustomerService}/check-8-condition-and-c06`,
    body
  );
};

export const useCheckCondition = () => {
  const { formAntd, setSuccessCheckCondition, setDisableButtonCheck } =
    useActiveSubscriptStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      if (res?.c06SuccessMessage) {
        NotificationSuccess(res?.c06SuccessMessage);
      }
      setSuccessCheckCondition(true);
      setDisableButtonCheck(true);
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        const newObj = groupBy(err?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        formAntd.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
    },
  });
};
