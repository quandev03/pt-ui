import { IPage } from '@react/commons/types';
import { useQuery } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { ISimReplacementItem, ISimReplacementParams } from '../types';

const fetcher = (params: ISimReplacementParams) => {
  return axiosClient.get<ISimReplacementParams, IPage<ISimReplacementItem>>(
    `${prefixCustomerService}/change-sim-bulk`,
    { params }
  );
};

export const useList = (params: ISimReplacementParams) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_SIM_REPLACEMENT_LIST, params],
    queryFn: () => fetcher(params),
    enabled: !!params.simType,
  });
};
