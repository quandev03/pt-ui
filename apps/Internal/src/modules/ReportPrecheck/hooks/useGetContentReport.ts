import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { IParamsReportPrecheck } from '../type';

export const useGetPrecheckReportKey = 'useGetPrecheckReportKey';

const fetcher = async (params: IParamsReportPrecheck) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/pre-approve-reports/render`,
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

export const useGetContentReport = (params: IParamsReportPrecheck) => {
  return useQuery({
    queryKey: [useGetPrecheckReportKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.fromDate,
  });
};
