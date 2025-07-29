import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { PackageCapacity, PackageCapacityRequest } from '../types';
import { prefixCustomerService } from '@react/url/app';
import { IPage } from '@react/commons/types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = (id: string, params: PackageCapacityRequest) => {
  return axiosClient.get<string, IPage<PackageCapacity>>(
    `${prefixCustomerService}/search-request/package-capacity/${id}`,
    { params }
  );
};

export const usePackageCapacityQuery = (
  id: string,
  params: PackageCapacityRequest
) => {
  return useQuery({
    queryFn: () => fetcher(id, params),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PACKAGE_CAPACITY, id, params],
    enabled: !!id,
  });
};
