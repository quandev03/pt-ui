import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { IParamsReportPostCheck } from '../type';

export const useGetPostCheckReportKey = 'useGetPostCheckReportKey';

const fetcher = async (params: IParamsReportPostCheck) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/audit-sub-reports/render`,
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

export const useGetContentReport = (params: IParamsReportPostCheck) => {
  return useQuery({
    queryKey: [useGetPostCheckReportKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.fromDate,
  });
};
