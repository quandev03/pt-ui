import { prefixSaleService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';
import { TopUpResponse } from './useTopUpSubscription';

interface Request extends TopUpResponse {
  otp: string;
}

export const queryKeyConfirmOtp = 'query-confirm-otp-top-up';

const fetcher = (payload: any) => {
  return axiosClient.post<Request, Response>(
    `${prefixSaleService}/topup-subcriber/confirm-otp`,
    payload
  );
};

export const useConfirmOtp = () => {
  return useMutation({
    mutationKey: [queryKeyConfirmOtp],
    mutationFn: fetcher,
  });
};
