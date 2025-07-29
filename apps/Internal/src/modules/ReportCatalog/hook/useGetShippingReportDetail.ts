import { prefixSaleServicePrivate } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

export interface IShippingReportDetail {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  deliveryFeeDetail: DeliveryFeeDetail;
  productInfo: ProductInfo;
  histories: History[];
  deliveryNo: string;
}

interface History {
  log: string;
  province: string;
  district: string;
  time: string;
}

interface ProductInfo {
  service: string;
  weight: number;
  dimensionWeight: number;
  width: number;
  length: number;
  height: number;
  cargoContent: string;
  dateDelivery: string;
  billStatusDesc: string;
  productAmount: number;
  deliveryCreatedDate: string;
}

interface DeliveryFeeDetail {
  totalFee: number;
  packingFee: number;
  liftingFee: number;
  mainFee: number;
  insuranceFee: number;
  remoteFee: number;
  otherFee: number;
  codAmount: number;
  codFee: number;
  countingFee: number;
}

const fetcher = async (id: string) => {
  const res = await axiosClient.get<string, IShippingReportDetail>(
    `${prefixSaleServicePrivate}/delivery-report/${id}/detail`
  );
  return res;
};

export const useGetShippingReportDetail = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
