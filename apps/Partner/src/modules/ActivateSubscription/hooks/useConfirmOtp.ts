import { AnyElement } from '@react/commons/types';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

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

const fetcher = (body: AnyElement) => {
  return axiosClient.post<FilterConfirmOtp, Res>(
    `${prefixCustomerServicePublic}/confirm-otp`,
    body
  );
};

export const useConfirmOtp = () => {
  return useMutation({
    mutationKey: [queryKeyConfirmOtp],
    mutationFn: fetcher,
  });
};
