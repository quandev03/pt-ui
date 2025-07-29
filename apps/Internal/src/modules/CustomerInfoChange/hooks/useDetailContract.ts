import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import {
  prefixCustomerService,
  prefixCustomerServicePublic,
} from 'apps/Internal/src/constants/app';
import { pathRoutes } from 'apps/Internal/src/constants/routes';

export const queryKeyDetailContract = 'query-detail-contract';

export interface ParamDetailContract {
  id: string | null;
  isSigned: boolean;
  isCommit?: boolean;
  pathname?: string;
  isND13: boolean;
}

const fetcher = (param: ParamDetailContract) => {
  if (param.isND13 === true) {
    return axiosClient.get<any, any>(
      `${prefixCustomerService}/change-information/get-decree-final/${param.id}`,
      {
        params: {
          contractNo: param.id,
        },
        responseType: 'blob',
      }
    );
  }
  if (param.isCommit === true) {
    if (param.isSigned === true) {
      return axiosClient.get<any, any>(
        `${prefixCustomerService}/change-information/get-ownership-commitment-final/${param.id}`,
        {
          params: {
            contractNo: param.id,
          },
          responseType: 'blob',
        }
      );
    } else {
      return axiosClient.get<any, any>(
        `${prefixCustomerService}/change-information/get-ownership-commitment/${param.id}`,
        {
          params: {
            contractNo: param.id,
          },
          responseType: 'blob',
        }
      );
    }
  } else {
    if (param.isSigned === true) {
      return axiosClient.get<any, any>(
        `${prefixCustomerService}/change-information/get-contract-final/${param.id}`,
        {
          params: {
            contractNo: param.id,
          },
          responseType: 'blob',
        }
      );
    } else {
      return axiosClient.get<any, any>(
        `${prefixCustomerService}/contract/${param.id}`,
        { responseType: 'blob' }
      );
    }
  }
};

export const useDetailContract = (param: ParamDetailContract) => {
  return useQuery({
    queryFn: () => fetcher(param),
    queryKey: [queryKeyDetailContract, param],
    enabled: !!param.id,
  });
};
