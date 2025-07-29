import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IServicePackageParams, ServicePackageItem } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = (params?: IServicePackageParams) => {
  return axiosClient.get<IServicePackageParams, IPage<ServicePackageItem>>(
    `${prefixCatalogService}/package-profile`,
    { params }
  );
};

export const useList = (params?: IServicePackageParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_OF_SERVICE_PACKAGE, params],
    queryFn: () => fetcher(params),
  });
};
