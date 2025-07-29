import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { IParamsRepresentative, IRepresentativeItem } from '../type';

const fetcher = (params: IParamsRepresentative) => {
  return axiosClient.get<IParamsRepresentative, IPage<IRepresentativeItem>>(
    `${prefixCustomerService}/authorized-person/search`,
    { params }
  );
};
export const useGetRepresentatives = (params: IParamsRepresentative) => {
  delete params.tab;
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_REPRESENTATIVES, params],
    queryFn: () => fetcher(params),
    enabled: !!params.enterpriseId,
  });
};
