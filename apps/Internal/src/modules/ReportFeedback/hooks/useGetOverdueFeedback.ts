import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { IParamsOverdueFeedbackReport } from '../type';

export const useGetOverdueFeedbackKey = 'useGetOverdueFeedbackKey';

const fetcher = async (params: IParamsOverdueFeedbackReport) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/feedback/overdue`,
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

export const useGetOverdueFeedback = (params: IParamsOverdueFeedbackReport) => {
  return useQuery({
    queryKey: [useGetOverdueFeedbackKey, params],
    queryFn: () => fetcher(params),
  });
};
