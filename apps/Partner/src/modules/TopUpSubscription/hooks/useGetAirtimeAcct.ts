import { useQuery } from '@tanstack/react-query';
import { prefixSaleService } from 'apps/Partner/src/constants/app';
import { axiosClient } from 'apps/Partner/src/service';

export const queryKeyGetAirtimeAcct = 'query-get-airtime-account';

const fetcher = () => {
  return axiosClient.get<undefined, any>(
    `${prefixSaleService}/topup-subcriber/get-airtime-account`
  );
};

export const useGetAirtimeAcct = () => {
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: [queryKeyGetAirtimeAcct],
    select: (res) => res,
  });
};
