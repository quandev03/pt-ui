import { AnyElement } from '@vissoft-react/common';

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
