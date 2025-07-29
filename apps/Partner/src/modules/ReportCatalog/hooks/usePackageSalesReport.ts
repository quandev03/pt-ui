import { useMutation, useQuery } from '@tanstack/react-query';
import { PackageSalesReportService } from '../services';
import { IParamsReport } from '../types';

export const PACKAGE_SALES_REPORT_QUERY_KEY = {
  LIST: 'query-list-package-sales-report',
  GET_TYPE: 'query-get-type',
};

export const useListPackageSalesReport = (params: IParamsReport) => {
  return useQuery({
    queryKey: [PACKAGE_SALES_REPORT_QUERY_KEY.LIST, params],
    queryFn: () => PackageSalesReportService.getList(params),
    enabled: !!params.fromDate && !!params.toDate,
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: PackageSalesReportService.downloadReport,
  });
};