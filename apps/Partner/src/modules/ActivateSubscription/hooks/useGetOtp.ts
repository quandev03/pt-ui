import { prefixCustomerServicePublic } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export interface FilterGetOtp {
  isdn: string;
  idEkyc: string;
}

export const queryKeySendOtp = 'customer-service/get-otp';
interface Res {
  isdn: string;
  idEkyc: string;
}

const fetcher = (body: FilterGetOtp) => {
  return axiosClient.post<FilterGetOtp, Res>(
    `${prefixCustomerServicePublic}/get-otp`,
    body
  );
};

export const useGetOtp = () => {
  return useMutation({
    mutationKey: [queryKeySendOtp],
    mutationFn: fetcher,
  });
};
