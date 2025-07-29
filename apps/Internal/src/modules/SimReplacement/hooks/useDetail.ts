import { axiosClient } from 'apps/Internal/src/service';
import { ISimReplacementDetail, ISimReplacementParams } from '../types';
import { IPage } from '@react/commons/types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';

const fetcher = ({
  params,
  id,
}: {
  params: ISimReplacementParams;
  id?: string;
}) => {
  return axiosClient.get<ISimReplacementParams, IPage<ISimReplacementDetail>>(
    `${prefixCustomerService}/change-sim-bulk/${id}/detail`,
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
