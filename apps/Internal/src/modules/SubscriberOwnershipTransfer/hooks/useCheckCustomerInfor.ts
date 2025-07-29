import { queryKey } from './../../LockPeriod/hook/useList';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { FormSubscriberOwnershipTransfer } from '../types';
import { IFieldErrorsItem, IErrorResponse } from '@react/commons/types';
import { NotificationError } from '@react/commons/Notification';

export type ParamCustomerInfor = Pick<
  FormSubscriberOwnershipTransfer,
  | 'isdn'
  | 'name'
  | 'idNo'
  | 'issueBy'
  | 'issueDate'
  | 'birthday'
  | 'sex'
  | 'address'
  | 'city'
  | 'district'
  | 'ward'
  | 'expiry'
  | 'appObject'
> & { idType: string };

export const queryKeyOldCustomerInfo = 'query-key-old-customer-info';

const fetcher = (body: any) => {
  return axiosClient.post<any, boolean>(
    `${prefixCustomerService}/change-information/check-old-information`,
    body
  );
};

export const useCheckCustomerInfor = (
  onSuccess: (isSuccessSuccess: boolean) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  return useMutation({
    mutationFn: fetcher,
    mutationKey: [queryKeyOldCustomerInfo],
    onSuccess: (isSuccessSuccess) => {
      onSuccess(isSuccessSuccess);
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};
