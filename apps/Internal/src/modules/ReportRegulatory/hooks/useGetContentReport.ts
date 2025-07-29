import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { IParamsReportRegulatory } from '../type';

export const useGetRegulatoryReportKey = 'useGetRegulatoryReportKey';

const fetcher = async (params: IParamsReportRegulatory) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/government-reports`,
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

export const useGetContentReport = (params: IParamsReportRegulatory) => {
  return useQuery({
    queryKey: [useGetRegulatoryReportKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.fromDate,
  });
};
