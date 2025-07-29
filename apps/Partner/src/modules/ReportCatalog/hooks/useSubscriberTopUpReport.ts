import { useMutation, useQuery } from '@tanstack/react-query';
import { SubscriberTopUpReportService } from '../services';
import { IParamsReport } from '../types';

export const SUBSCRIBER_TOPUP_REPORT_QUERY_KEY = {
  LIST: 'query-list-subscriber-topUp-report',
};

export const useListSubscriberTopUpReport = (params: IParamsReport) => {
  return useQuery({
    queryKey: [SUBSCRIBER_TOPUP_REPORT_QUERY_KEY.LIST, params],
    queryFn: () => SubscriberTopUpReportService.getList(params),
    enabled: !!params.fromDate && !!params.toDate,
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: SubscriberTopUpReportService.downloadReport,
  });
};