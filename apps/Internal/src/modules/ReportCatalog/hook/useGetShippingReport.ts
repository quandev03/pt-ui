import { IPage, IParamsRequest } from '@react/commons/types';
import { prefixSaleServicePrivate } from '@react/url/app';
import { downloadFile } from '@react/utils/handleFile';
import { useMutation, useQuery } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';

export interface IParamsShippingReport extends IParamsRequest {
  q?: string;
  status?: string;
  partner?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IShippingReport {
  id: string;
  amountTotal: number;
  codAmount: number;
  codFee: number;
  deliveryCreatedDate: string;
  deliveryFee: number;
  deliveryMethod: string;
  deliveryNo: string;
  deliveryPickupDate: null;
  lastUpdated: string;
  mainFee: number;
  note: null;
  orderDate: string;
  orderNo: string;
  otherFee: number;
  partner: string;
  paymentMethod: string;
  quantity: number;
  receiveAddress: string;
  sendAddress: string;
  status: number;
  totalFee: number;
}

export const useGetContentShippingReportKey = 'useGetContentShippingReportKey';

const fetcher = async (params: IParamsShippingReport) => {
  const res = await axiosClient.get<string, IPage<IShippingReport>>(
    `${prefixSaleServicePrivate}/delivery-report`,
    {
      params,
    }
  );
  return res;
};

export const useGetContentShippingReport = (params: IParamsShippingReport) => {
  return useQuery({
    queryKey: [useGetContentShippingReportKey, params],
    queryFn: () => fetcher(params),
    enabled: !!params.fromDate && !!params.toDate,
  });
};

export const useGetCurrentOrganizationKey = 'useGetCurrentOrganizationKey';

const fetcherDownload = async (params: IParamsShippingReport) => {
  const res = await axiosClient.get<string, Blob>(
    `${prefixSaleServicePrivate}/delivery-report/export`,
    {
      params,
      responseType: 'blob',
    }
  );

  const name = useFileNameDownloaded.getState().name;
  downloadFile(res, name);
  return res;
};

export const useDownloadShippingReport = () => {
  return useMutation({
    mutationFn: fetcherDownload,
  });
};
