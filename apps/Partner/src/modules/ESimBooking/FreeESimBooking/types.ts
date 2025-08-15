import { AnyElement } from '@vissoft-react/common';

export interface IFreeEsimBooking {
  amountTotal: number;
  cancelReason: string;
  createdBy: string;
  createdDate: string;
  customerEmail: string;
  description: string;
  failedNumber: number;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  note: string;
  orderDate: string;
  orderNo: AnyElement;
  orderType: number;
  orgId: string;
  packageCodes: string;
  quantity: number;
  reasonId: string;
  successedNumber: number;
}

export interface IBookFreeEsim {
  id?: string;
  quantity: number;
  pckCode: string[];
  description: string;
}
interface IPackageRequest {
  id?: string;
  quantity: number;
  packageCode: string;
}

export interface IBookFreeEsimPayload {
  requests: IPackageRequest[];
  note: string;
}

export interface IPackage {
  createdBy: string;
  createdDate: string;
  description: string;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  packagePrice: number;
  pckCode: string;
  pckName: string;
  status: number;
  urlImagePackage: string;
}
