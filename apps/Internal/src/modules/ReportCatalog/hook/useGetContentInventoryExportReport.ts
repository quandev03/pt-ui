import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { IParamsRequest } from '@react/commons/types';
import { Dayjs } from 'dayjs';

export interface IParamsInventoryExportReport extends IParamsRequest {
  fromDate: string;
  toDate: string;
  orgCode?: string;
  orgId?: string;
  clientId?: string;
  type?: string;
  period?: [Dayjs, Dayjs];
}

export const useGetContentInventoryExportReportKey =
  'useGetContentInventoryExportReportKey';
const fetcher = async (params: IParamsInventoryExportReport) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/stock-out`,
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

export const useGetContentInventoryExportReport = (
  params: IParamsInventoryExportReport
) => {
  return useQuery({
    queryKey: [useGetContentInventoryExportReportKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.fromDate && !!params.toDate,
  });
};
