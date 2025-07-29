import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { IParamsDetailFeedbackReport } from '../type';

export const useGetDetailFeedbackKey = 'useGetDetailFeedbackKey';

const fetcher = async (params: IParamsDetailFeedbackReport) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/feedback/detail`,
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

export const useGetDetailFeedback = (params: IParamsDetailFeedbackReport) => {
  return useQuery({
    queryKey: [useGetDetailFeedbackKey, params],
    queryFn: () => fetcher(params),
  });
};
