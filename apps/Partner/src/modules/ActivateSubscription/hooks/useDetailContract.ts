import { AnyElement } from '@react/commons/types';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Partner/src/service';

export const queryKeyDetailContract = 'query-detail-contract';

export interface ParamDetailContract {
  id: string | null;
  isSigned: boolean;
  isND13?: boolean;
  pathname?: string;
}

const fetcher = (param: ParamDetailContract) => {
  if (param.isND13 === true) {
    if (param.isSigned === true) {
      return axiosClient.get<AnyElement, AnyElement>(
        `${prefixCustomerServicePublic}/contract-decree/view-before/${param.id}`,
        { responseType: 'blob' }
      );
    } else {
      return axiosClient.get<AnyElement, AnyElement>(
        `${prefixCustomerServicePublic}/contract-decree/view-after/${param.id}`,
        { responseType: 'blob' }
      );
    }
  } else {
    return axiosClient.get<AnyElement, AnyElement>(
      `${prefixCustomerServicePublic}/contract/${param.id}`,
      { responseType: 'blob' }
    );
  }
};

export const useDetailContract = (param: ParamDetailContract) => {
  return useQuery({
    queryFn: () => fetcher(param),
    queryKey: [queryKeyDetailContract, param],
    enabled: !!param.id,
  });
};
