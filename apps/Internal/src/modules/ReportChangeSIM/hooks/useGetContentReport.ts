import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { IParamsReportChangeSim } from '../type';

export const useGetChangeSimReportKey = 'useGetChangeSimReportKey';

const fetcher = async (params: IParamsReportChangeSim) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/change-sim`,
    { params }
  );

  const data = {
    data: res.data,
    pagination: {
      total: res.headers['x-total-elements'] ?? 0,
      current: res.headers['x-page-number'] ?? 0,
      pageSize: res.headers['x-page-size'] ?? 0,
    },
  };
  return data;
};

export const useGetContentReport = (params: IParamsReportChangeSim) => {
  return useQuery({
    queryKey: [useGetChangeSimReportKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.fromDate,
  });
};
