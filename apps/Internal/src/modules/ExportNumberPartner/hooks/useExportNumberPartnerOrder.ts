import { prefixResourceService } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';

export interface ExportNumberPartnerOrderType {
  orderId: any;
  orderNo: string;
  quantity: number;
  remainingQuantity: number;
  numberProductLineCount: number;
  partnerStockId: number;
  partnerStockName: string;
  partnerStockCode: string;
}

const fetcher = () => {
  return axiosClient.get<string, ExportNumberPartnerOrderType[]>(
    `${prefixResourceService}/export-number-for-partner/orders`
  );
};

export const useExportNumberPartnerOrder = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.ExportNumberPartnerOrderKey],
    queryFn: fetcher,
  });
};
