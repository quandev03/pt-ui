import { NotificationSuccess, NotificationWarning } from '@react/commons/Notification';
import { AnyElement, CommonError } from '@react/commons/types';
import { useMutation } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { groupBy } from 'lodash';
import { useActiveSubscriptStore } from '../store';

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

export const useCheckCondition = (form: FormInstance, onSuccess: (data: any) => void,) => {
  const { setSuccessCheckCondition, isSignAgainFlag } = useActiveSubscriptStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data,res) => {
      setSuccessCheckCondition(true);
      if(isSignAgainFlag) NotificationWarning("Bạn đã sửa các thông tin có trong hợp đồng/biểu mẫu. Vui lòng kí lại hợp đồng.")
      else if (data) NotificationSuccess(data.c06SuccessMessage);
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        const newObj = groupBy(err?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        form.setFields(
          res?.map((item: AnyElement) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
    },
  });
};
