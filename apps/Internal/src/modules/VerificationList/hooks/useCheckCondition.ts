import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import {
  AnyElement,
  CommonError,
  IFieldErrorsItem,
} from '@react/commons/types';
import { IDType } from '@react/constants/app';
import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

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
  idExpiryDateNote: string;
}

const fetcher = (body: ParamCheckCondition) => {
  const { idExpiryDateNote, ...payload } = body;
  return axiosClient.post<ParamCheckCondition, AnyElement>(
    `${prefixCustomerService}/check-8-condition-and-c06`,
    payload
  );
};

export const useCheckCondition = (
  onError: (errorField: IFieldErrorsItem[]) => void,
  onSuccess?: () => void,
  noMessage?: boolean
) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res, variables) => {
      if (res?.c06SuccessMessage && !noMessage) {
        NotificationSuccess(res?.c06SuccessMessage);
      }
      if (variables.document === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể sử dụng với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
        return;
      }
      if (!variables.expiry && !variables.idExpiryDateNote) {
        NotificationError(
          'Vui lòng điền thông tin Ngày hết hạn giấy tờ hoặc Ngày hết hạn'
        );
        return;
      }
      onSuccess && onSuccess();
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        const mappedErrors = err.errors.map((error) => ({
          ...error,
          field: error.field === 'issue_by' ? 'id' : error.field
        }));
        onError(mappedErrors);
      }
    },
  });
};
