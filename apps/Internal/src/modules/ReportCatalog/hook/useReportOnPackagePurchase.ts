import { NotificationSuccess } from '@react/commons/Notification';
import { AnyElement } from '@react/commons/types';
import { FILE_TYPE } from '@react/constants/app';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { prefixSaleServicePrivate } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';
import axios from 'axios';
import dayjs from 'dayjs';
const uriSearch = `${prefixSaleServicePrivate}/sale-orders/search-buy-package`;
const uriExport = `${prefixSaleServicePrivate}/sale-orders/search-buy-package/export`;
export const REPORT_ON_PACKAGE_PURCHASE_QUERY_KEY =
  'get-report-on-package-purchase';
export interface IParamsReportOnPakcPackagePurchase {
  fromDate: string;
  toDate: string;
  page: number;
  size: number;
  searchValue?: string;
  status?: number;
  paymentStatus?: number
}
const fetcher = async (params: IParamsReportOnPakcPackagePurchase): Promise<AnyElement> => {
    const customParams = {
      fromDate: params.fromDate
        ? dayjs(params.fromDate).startOf('day').format(formatDateEnglishV2)
        : dayjs().subtract(29, 'day').startOf('day').format(formatDateEnglishV2),
      toDate: params.toDate
        ? dayjs(params.toDate).endOf('day').format(formatDateEnglishV2)
        : dayjs().endOf('day').format(formatDateEnglishV2),
      page: params.page,
      size: params.size,
      searchValue: params.searchValue,
      status: params.status,
      paymentStatus: params.paymentStatus
    };
    const res = await axiosClient.get<string, AnyElement>(uriSearch, {
      params: customParams
    });
    return res;
};
const fetcherUpdate = async (data:{orderId:string, description:string}): Promise<AnyElement> => {
    const res = await axiosClient.put<string, AnyElement>(`${prefixSaleServicePrivate}/sale-orders/buy-package-order/${data.orderId}`, { description: data.description });
    return res;
};
const fetchExportFile = async (params: IParamsReportOnPakcPackagePurchase): Promise<AnyElement> => {
    const customParams = {
      fromDate: params.fromDate
        ? dayjs(params.fromDate).startOf('day').format(formatDateEnglishV2)
        : dayjs().subtract(29, 'day').startOf('day').format(formatDateEnglishV2),
      toDate: params.toDate
        ? dayjs(params.toDate).endOf('day').format(formatDateEnglishV2)
        : dayjs().endOf('day').format(formatDateEnglishV2),
      page: params.page,
      size: params.size,
      searchValue: params.searchValue,
      status: params.status,
      paymentStatus: params.paymentStatus
    };
    const res = await axiosClient.get<string, AnyElement>(uriExport, {
      params: customParams,
      responseType: 'blob',
    });
    return res;
};
export const useGetReportOnPackagePurchase = (params: IParamsReportOnPakcPackagePurchase) => {
  return useQuery({
    queryKey: [REPORT_ON_PACKAGE_PURCHASE_QUERY_KEY, params],
    queryFn: () => fetcher(params),
  });
};
export const useUpdateReportOnPackagePurchase = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcherUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REPORT_ON_PACKAGE_PURCHASE_QUERY_KEY],
      });
      NotificationSuccess(MESSAGE.G02);
      onSuccess && onSuccess();
    },
  });
};
export const useDownloadFileReportOnPackagePurchase = () => {
  return useMutation({
    mutationFn: fetchExportFile,
    onSuccess: (data) => {
      const name = useFileNameDownloaded.getState().name
        ? useFileNameDownloaded.getState().name
        : "Báo cáo gói cước";
      downloadFileFn(data, name,FILE_TYPE.xlsx);
    },
  });
};