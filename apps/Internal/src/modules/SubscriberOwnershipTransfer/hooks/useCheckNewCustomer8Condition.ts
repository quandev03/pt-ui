import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { CommonError, IFieldErrorsItem } from '@react/commons/types';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreOwnershipTransferPage from '../store';

export type PayloadCheck8ConditionNewCus = {
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
};

const fetcher = (body: PayloadCheck8ConditionNewCus) => {
  return axiosClient.post<PayloadCheck8ConditionNewCus, any>(
    `${prefixCustomerService}/check-8-condition-and-c06`,
    body
  );
};

export const useCheckNewCustomer8Condition = (
  onSuccess: () => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const { setSuccessCheckCondition, setDisableNewButtonCheck } =
    useStoreOwnershipTransferPage();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      onSuccess();
      if (res?.c06SuccessMessage) {
        NotificationSuccess(res?.c06SuccessMessage);
      }
      setSuccessCheckCondition(true);
      setDisableNewButtonCheck(true);
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        onError(err?.errors);
      } else {
        NotificationError(err.detail);
      }
    },
  });
};
