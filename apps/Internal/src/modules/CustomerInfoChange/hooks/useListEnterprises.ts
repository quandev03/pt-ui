import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';

const fetcher = () => {
  return axiosClient.get<any>(
    `${prefixCustomerService}/enterprise/find-all`,
  );
};

export const useEnterprisesList = () => {
    return useQuery({
      queryKey: [REACT_QUERY_KEYS.GET_LIST_ENTERPRISES],
      queryFn: () => fetcher(),
      select: (data: any) => data,
    });
  };
  