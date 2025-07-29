import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

export interface FilterConfirmOtp {
  isdn: string;
  idEkyc: string;
  id: string;
  otp: string;
  transactionId: string;
}

interface Res {
  id: string;
  isdn: string;
  idEkyc: string;
  transactionId: string;
}

export const queryKeyConfirmOtp = 'query-confirm-otp';

const fetcher = (body: any) => {
  return axiosClient.post<FilterConfirmOtp, Res>(
    `${prefixCustomerService}/confirm-otp`,
    body
  );
};

export const useConfirmOtp = () => {
  return useMutation({
    mutationKey: [queryKeyConfirmOtp],
    mutationFn: fetcher,
  });
};
