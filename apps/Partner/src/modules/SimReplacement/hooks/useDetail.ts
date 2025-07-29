import { IPage } from '@react/commons/types';
import { prefixCustomerServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { axiosClient } from 'apps/Partner/src/service';
import { ISimReplacementDetail, ISimReplacementParams } from '../types';

const fetcher = ({
  params,
  id,
}: {
  params: ISimReplacementParams;
  id?: string;
}) => {
  return axiosClient.get<ISimReplacementParams, IPage<ISimReplacementDetail>>(
    `${prefixCustomerServicePublic}/change-sim-bulk/${id}/detail`,
    { params }
  );
};
export const useGetDetail = ({
  params,
  id,
}: {
  params: ISimReplacementParams;
  id?: string;
}) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_SIM_REPLACEMENT_DETAIL, params, id],
    queryFn: () => fetcher({ params, id }),
    enabled: !!params.fromDate,
  });
};
