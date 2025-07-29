import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { PackageHistoryRequest, ImpactHistory } from '../types';
import { IPage } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (id: string, params: PackageHistoryRequest) => {
  return axiosClient.get<PackageHistoryRequest, IPage<ImpactHistory>>(
    `${prefixCustomerService}/search-request/reg-package-history/${id}`,
    { params }
  );
};

export const usePackageHistoryQuery = (
  id: string,
  params: PackageHistoryRequest
) => {
  return useQuery({
    queryFn: () => fetcher(id, params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PACKAGE_HISTORY, id, params],
    enabled: !!id,
  });
};
