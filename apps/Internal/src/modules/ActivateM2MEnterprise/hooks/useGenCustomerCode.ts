import { useQuery } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export interface Req {
  idNo: string;
}

interface Res {
  customerCode: string;
}

const fetcher = (idNo: string) => {
  return axiosClient.post<Req, Res>(
    `${prefixCustomerService}/gen-customer-code`,
    null,
    {
      params: {
        idNo,
      },
    }
  );
};

export const useGenCustomerCode = (idNo: string) => {
  return useQuery({
    queryKey: ['gen-customer-code', idNo],
    queryFn: () => fetcher(idNo),
    select: (data: Res) => data,
    enabled: !!idNo,
  });
};
