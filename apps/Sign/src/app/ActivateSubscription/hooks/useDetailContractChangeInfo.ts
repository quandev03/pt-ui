import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Sign/src/service';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useLocation } from 'react-router-dom';
import { pathRouterSign } from '@react/url/pathRouterSign';

export const queryKeyDetailContract =
  'query-detail-useDetailContractChangeInfo';

export interface ParamDetailContract {
  id: string | null;
  pathname?: string;
}

const fetcher = (param: ParamDetailContract) => {
  return axiosClient.get<any, any>(
    `${prefixCustomerServicePublic}/change-information/get-ownership-commitment/${param.id}`,
    { responseType: 'blob' }
  );
};

export const useDetailContractChangeInfo = (param: ParamDetailContract) => {
  const location = useLocation();
  return useQuery({
    queryFn: () => fetcher({ ...param, pathname: location.pathname }),
    queryKey: [queryKeyDetailContract, param, location.pathname],
    enabled: !!param.id && location.pathname === pathRouterSign.changeInfo,
  });
};
