import { axiosClient } from 'apps/Internal/src/service';
import { ServicePackageItem } from '../types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';

const fetcher = async (id: string) => {
  if (id === '') return;
  const res = await axiosClient.get<any, ServicePackageItem>(
    `${prefixCatalogService}/package-profile/${id}`
  );
  return res;
};
export const useView = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_PACKAGE_DETAIL, id],
    queryFn: () => fetcher(id),
    enabled: !!id,
  });
};
