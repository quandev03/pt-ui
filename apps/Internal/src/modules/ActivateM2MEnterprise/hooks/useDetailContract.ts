import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import {
  prefixCustomerService,
  prefixCustomerServicePublic,
} from 'apps/Internal/src/constants/app';

export const queryKeyDetailContract = 'query-detail-contract';

export interface ParamDetailContract {
  id: string | null;
  isSigned: boolean;
  isND13?: boolean;
}

const fetcher = (param: ParamDetailContract) => {
  if (param.isND13 === true) {
    if (param.isSigned === true) {
      return axiosClient.get<any, any>(
        `${prefixCustomerServicePublic}/contract-decree/view-before/${param.id}`,
        { responseType: 'blob' }
      );
    } else {
      return axiosClient.get<any, any>(
        `${prefixCustomerService}/contract-decree/view-after/${param.id}`,
        { responseType: 'blob' }
      );
    }
  } else {
    return axiosClient.get<any, any>(
      `${
        param.isSigned ? prefixCustomerServicePublic : prefixCustomerService
      }/contract/${param.id}`,
      { responseType: 'blob' }
    );
  }
};

export const useDetailContract = (param: ParamDetailContract) => {
  return useQuery({
    queryFn: () => fetcher(param),
    queryKey: [queryKeyDetailContract, param.id, param.isSigned, param.isND13],
    enabled: !!param.id,
  });
};
