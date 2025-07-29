import { prefixSaleService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export interface TopUpRequest {
  isdn: string;
  amount: number;
}

export interface TopUpResponse {
  id: string;
  isdn: string;
  idEkyc: string;
  transactionId: string;
}

export const queryKeyTopUp = 'query-top-up-subscription';

const fetcher = (payload: any) => {
  return axiosClient.post<Request, TopUpResponse>(
    `${prefixSaleService}/topup-subcriber`,
    payload
  );
};

export const useTopUpSubscription = () => {
  return useMutation({
    mutationKey: [queryKeyTopUp],
    mutationFn: fetcher,
  });
};
