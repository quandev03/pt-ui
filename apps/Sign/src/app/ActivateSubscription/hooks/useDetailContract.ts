import { prefixCustomerServicePublic } from '@react/url/app';
import { pathRouterSign } from '@react/url/pathRouterSign';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Sign/src/service';
import { useLocation } from 'react-router-dom';

export const queryKeyDetailContract = 'query-detail-contract';

export interface ParamDetailContract {
  id: string | null;
  timeStampContract?: string;
  pathname?: string;
}

const fetcher = (param: ParamDetailContract) => {
  if (param.pathname === pathRouterSign.changeSim) {
    return axiosClient.get<any, any>(
      `${prefixCustomerServicePublic}/change-sim/contract/${param.id}`,
      { responseType: 'blob' }
    );
  }
  if (param.pathname === pathRouterSign.censorship) {
    return axiosClient.get<any, any>(
      `${prefixCustomerServicePublic}/contract-approval/${param.id}?timeStampContract=${param.timeStampContract}`,
      { responseType: 'blob' }
    );
  }
  return axiosClient.get<any, any>(
    `${prefixCustomerServicePublic}/contract-temp/${param.id}`,
    { responseType: 'blob' }
  );
};

export const useDetailContract = (param: ParamDetailContract) => {
  const location = useLocation();
  return useQuery({
    queryFn: () => fetcher({ ...param, pathname: location.pathname }),
    queryKey: [queryKeyDetailContract, param, location.pathname],
    enabled: !!param.id,
  });
};
