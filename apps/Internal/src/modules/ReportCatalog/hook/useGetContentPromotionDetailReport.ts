import { IParamsRequest } from '@react/commons/types';
import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';

export interface IParamsPromotionDetailReport extends IParamsRequest {
  q?: string;
  promotionType?: string;
}

export const useGetContentPromotionDetailReportKey =
  'useGetContentPromotionDetailReportKey';

const fetcher = async (params: IParamsPromotionDetailReport) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/promotion-report`,
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

export const useGetContentPromotionDetailReport = (
  params: IParamsPromotionDetailReport
) => {
  return useQuery({
    queryKey: [useGetContentPromotionDetailReportKey, params],
    queryFn: () => fetcher(params),
  });
};
