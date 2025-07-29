import { IParamsRequest } from '@react/commons/types';
import { prefixReportService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { Dayjs } from 'dayjs';

export interface IParamsOnlineOrderDetailReport extends IParamsRequest {
  fromDate: string;
  toDate: string;
  partner?: string;
  orgId?: string;
  status?: string;
  period: [Dayjs, Dayjs];
}

const useGetContentOnlineOrderDetailReportKey =
  'useGetContentOnlineOrderDetailReportKey';
const fetcher = async (params: IParamsOnlineOrderDetailReport) => {
  const res = await axiosClient.get<string, AxiosResponse<string>>(
    `${prefixReportService}/online-order`,
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

export const useGetContentOnlineOrderDetailReport = (
  params: IParamsOnlineOrderDetailReport
) => {
  return useQuery({
    queryKey: [useGetContentOnlineOrderDetailReportKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.fromDate && !!params.toDate,
  });
};
