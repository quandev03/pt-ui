import { IParamsRequest } from '@vissoft-react/common';

export interface IReportPartnerItem {
  id: string;
  orderCode: string;
  partnerCode: string;
  partnerName: string;
  serviceType: string;
  agentName: string;
  totalPrice: number;
  orderedBy: string;
  orderedAt: string;
  listProduct: IProductItem[];
}
export interface IProductItem {
  id: string;
  productName: string;
  productCode: string;
  eSIMCount: number;
  packageFee: number;
}

export interface IReportPartnerParams extends IParamsRequest {
  partner?: string;
}
