import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { ImpactType, PackageRegis } from '../types';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from '@react/url/app';

const fetcher = (id: string, type?: ImpactType) => {
  return axiosClient.get<string, PackageRegis[]>(
    `${prefixCustomerService}/reg-del-pck/${
      type === ImpactType.REGISTER_PACKAGE
        ? 'check-sub-package'
        : 'receiver-service'
    }/${id}`
  );
};

export const usePackageRegisQuery = (id: string, type?: ImpactType) => {
  return useQuery({
    queryFn: () => fetcher(id, type),
    queryKey: [REACT_QUERY_KEYS.GET_LIST_PACKAGE_REGIS, id, type],
    enabled: !!id && !!type,
    select: (data) =>
      data.map((item) => ({
        label: item.packageCode,
        value: JSON.stringify(item),
      })),
  });
};
