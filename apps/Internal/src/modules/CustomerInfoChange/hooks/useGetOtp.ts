import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

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
    `${prefixCustomerService}/get-otp`,
    body
  );
};

export const useGetOtp = () => {
  return useMutation({
    mutationKey: [queryKeySendOtp],
    mutationFn: fetcher,
  });
};
