import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { IParamsReportCensorship } from '../type';

export const useGetCensorshipReportKey = 'useGetCensorshipReportKey';

const fetcher = async (params: IParamsReportCensorship) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/approve-subscriber`,
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

export const useGetContentReport = (params: IParamsReportCensorship) => {
  return useQuery({
    queryKey: [useGetCensorshipReportKey, params],
    queryFn: () => fetcher(params),
  });
};
