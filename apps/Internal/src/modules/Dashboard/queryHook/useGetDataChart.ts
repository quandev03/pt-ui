import { prefixCustomerService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IChartItem, IChartParam } from '../type';

const fetcher = async (params: IChartParam) => {
  return axiosClient.get<IChartParam, IChartItem[]>(
    `${prefixCustomerService}/dashboard/active-sub`,
    { params }
  );
};
export const useGetDataChart = (params: IChartParam) => {
  return useQuery({
    queryKey: ['GET_DATA_CHART', params],
    queryFn: () => fetcher(params),
  });
};
