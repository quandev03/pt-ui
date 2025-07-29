import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IEximDistributorContent } from '../type';
import { prefixSaleService } from 'apps/Internal/src/constants/app';

const fetcher = (params?: any) => {
  return axiosClient.get<string, IPage<IEximDistributorContent>>(
    `${prefixSaleService}/stock-move`,
    { params: { ...params, moveType: 3 } }
  );
};

export const useListEximDistributor = (params?: any) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_EXIM_DISTRIBUTOR, params],
    queryFn: () => fetcher(params),
  });
};
