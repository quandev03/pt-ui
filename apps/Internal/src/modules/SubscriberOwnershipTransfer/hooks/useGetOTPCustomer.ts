import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface BodyOTPBodyOTP {
  idEkyc: string;
  isdn: string;
}
export interface IDataOTPCustomer {
  id: string;
  isdn: string;
  idEkyc: string;
  transactionId: string;
}

const fetcher = (body: BodyOTPBodyOTP) => {
  return axiosClient.post<BodyOTPBodyOTP, IDataOTPCustomer>(
    `${prefixCustomerService}/get-otp`,
    body
  );
};

export const useGetOTPCustomer = (
  onSuccess: (data: IDataOTPCustomer) => void
) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      onSuccess(res);
    },
  });
};
