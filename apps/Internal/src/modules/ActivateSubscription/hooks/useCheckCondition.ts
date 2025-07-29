import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { CommonError } from '@react/commons/types';
import { groupBy } from 'lodash';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IDType } from '../../VerificationList/types';

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
      if (formAntd.getFieldValue('document') === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể kích hoạt với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
        return;
      }
      if (res?.c06SuccessMessage) {
        NotificationSuccess(res?.c06SuccessMessage);
      }
      if (
        !formAntd.getFieldValue('expiry') &&
        !formAntd.getFieldValue('idExpiryDateNote')
      ) {
        NotificationError(
          'Vui lòng điền thông tin Ngày hết hạn giấy tờ hoặc Ngày hết hạn'
        );
        return;
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
