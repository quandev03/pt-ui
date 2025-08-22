import { IParamsRequest } from '@vissoft-react/common';

export interface IReportPartnerItem {
  amountTotal: number;
  createdBy: string;
  id: string;
  orderDate: string;
  orderNo: string;
  orderType: number;
  orgCode: string;
  orgName: string;
  quantity: number;
  succeededNumber: number;
}
export interface IProductItem {
  id: string;
  productName: string;
  productCode: string;
  eSIMCount: number;
  packageFee: number;
}

export interface IReportPartnerParams extends IParamsRequest {
  startDate: string;
  endDate: string;
  orgCode: string;
}
