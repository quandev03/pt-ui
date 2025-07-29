import { AnyElement } from '@react/commons/types';
import { prefixSaleService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export const GET_AMOUNT_QUERY_KEY = 'get-amount';
const fetcher = async () => {
  const res = await axiosClient.get<string, AnyElement>(
    `${prefixSaleService}/topup-subcriber/get-airtime-account`
  );
  return res;
};
const useGetAmount = () => {
  return useQuery({
    queryKey: [GET_AMOUNT_QUERY_KEY],
    queryFn: () => fetcher(),
  });
};
export default useGetAmount;
