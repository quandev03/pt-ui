import { IErrorResponse } from '@react/commons/types';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface BodyConfirmOTP {
  otp: string;
  id: string;
  isdn: string;
  idEkyc: string;
  transactionId: string;
  idNo: string;
}
export interface IDataConfirmOTPCustomer {
  id: string;
  isdn: string;
  idEkyc: string;
  transactionId: string;
  status: string;
}

const fetcher = (body: BodyConfirmOTP) => {
  return axiosClient.post<BodyConfirmOTP, IDataConfirmOTPCustomer>(
    `${prefixCustomerService}/confirm-otp`,
    body
  );
};

export const useConfirmOTPCustomer = (
  onSuccess: (data: IDataConfirmOTPCustomer) => void,
  onFail: (error: IErrorResponse) => void
) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      onSuccess(res);
    },
    onError: (error: IErrorResponse) => {
      onFail(error);
    },
  });
};
