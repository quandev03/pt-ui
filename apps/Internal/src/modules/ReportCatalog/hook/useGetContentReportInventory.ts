import { IParamsRequest } from '@react/commons/types';
import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { Dayjs } from 'dayjs';

export interface IParamsReportReportInventory extends IParamsRequest {
  orgId?: string;
  period: [Dayjs, Dayjs];
  format?: 'PDF' | 'HTML' | 'XLSX' | 'CSV';
  includeChildren?: 0 | 1;
  fromDate?: string;
  toDate?: string;
}

export const useGetCurrentOrganizationKey = 'useGetCurrentOrganizationKey';
const fetcher = async (params: IParamsReportReportInventory) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/inventory-reports`,
    {
      params: {
        ...params,
        period: undefined,
      },
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

export const useGetContentReportInventory = (
  params: IParamsReportReportInventory
) => {
  return useQuery({
    queryKey: [useGetCurrentOrganizationKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.orgId && !!params.fromDate && !!params.toDate,
  });
};
