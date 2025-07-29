import { useQuery } from '@tanstack/react-query';
import {
  prefixCustomerService,
  prefixCustomerServicePublic,
} from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

export const queryKeyDetailContract = 'query-detail-contract';

export interface ParamDetailContract {
  id: string | null;
  isSigned: boolean;
  isND13?: boolean;
}

const fetcher = async (param: ParamDetailContract) => {
  let blob: Blob;
  
  if (param.isND13 === true) {
    if (param.isSigned === true) {
      blob = (await axiosClient.get(
        `${prefixCustomerServicePublic}/contract-decree/view-before/${param.id}`,
        { responseType: 'blob' }
      )) as Blob;
    } else {
      blob = (await axiosClient.get(
        `${prefixCustomerService}/contract-decree/view-after/${param.id}`,
        { responseType: 'blob' }
      )) as Blob;
    }
  } else {
    blob = (await axiosClient.get(
      param.isSigned
        ? `${prefixCustomerServicePublic}/contract/${param.id}`
        : `${prefixCustomerService}/contract/${param.id}`,
      { responseType: 'blob' }
    )) as Blob;
  }
  
  return window.URL.createObjectURL(blob);
};

export const useDetailContract = (param: ParamDetailContract) => {
  return useQuery({
    queryFn: () => fetcher(param),
    queryKey: [
      queryKeyDetailContract,
      param.id,
      param.isSigned,
      param.isND13,
      param,
    ],
    enabled: !!param.id,
  });
};
