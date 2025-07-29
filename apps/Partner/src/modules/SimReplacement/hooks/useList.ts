import { IPage } from '@react/commons/types';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { axiosClient } from 'apps/Partner/src/service';
import { ISimReplacementItem, ISimReplacementParams } from '../types';

const fetcher = (params: ISimReplacementParams) => {
  return axiosClient.get<ISimReplacementParams, IPage<ISimReplacementItem>>(
    `${prefixCustomerServicePublic}/change-sim-bulk`,
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
