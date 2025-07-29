import { IParamsRequest } from '@react/commons/types';
import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';

export interface IParamsPromotionSummaryReport extends IParamsRequest {
  valueSearch?: string;
  promMethod?: string;
}

export const useGetContentPromotionSummaryReportKey =
  'useGetContentPromotionSummaryReportKey';
const fetcher = async (params: IParamsPromotionSummaryReport) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/promotion-program/summary`,
    {
      params,
    }
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

export const useGetContentPromotionSummaryReport = (
  params: IParamsPromotionSummaryReport
) => {
  return useQuery({
    queryKey: [useGetContentPromotionSummaryReportKey, params],
    queryFn: () => fetcher(params),
  });
};
