import { AnyElement, IParamsRequest } from '@vissoft-react/common';

export interface IPartnerParams extends IParamsRequest {
  startDate: string;
  endDate: string;
  orgCode: string;
}

export interface IPartnerOrderReport {
  amountTotal: AnyElement;
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
