import { prefixCustomerServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export interface Req {
  idNo: string;
}

interface Res {
  customerCode: string;
}

const fetcher = (idNo: string) => {
  return axiosClient.post<Req, Res>(
    `${prefixCustomerServicePublic}/gen-customer-code`,
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
