import { IParamsRequest } from '@react/commons/types';
import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';

export interface IParamsPartnerOrderReport extends IParamsRequest {
  q?: string;
  fromDate: string;
  toDate: string;
}

export const useGetContentPartnerOrderReportKey =
  'useGetContentPartnerOrderReportKey';
const fetcher = async (params: IParamsPartnerOrderReport) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/sale-order-partner`,
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

export const useGetContentPartnerOrderReport = (
  params: IParamsPartnerOrderReport
) => {
  return useQuery({
    queryKey: [useGetContentPartnerOrderReportKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.fromDate && !!params.toDate,
  });
};
