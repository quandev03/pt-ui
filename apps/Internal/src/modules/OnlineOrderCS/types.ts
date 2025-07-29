import { SIM_TYPE } from '../OnlineOrders/types';

export interface IOnlineOrdersCSManagement {
  id: number;
  orderNo: string;
  deliveryTransCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  orderTime: string;
  productAmount: number;
  deliveryFee: number;
  amountTotal: number;
  deliveryStatus: number;
  deliveryStatusName: string;
  payStatus: number;
  combinedKitUser: string;
  combinedKitTime: string;
  channel: string;
  deliveryMethodName: string;
  deliveryPartnerCode: string;
  deliveryPartnerName: string;
  note: string;
  cancelTime: string;
  cancelUser: string;
  cancelReason: string;
  isdn: string;
  serial: number;
  packageName: string;
  payStatusName: string;
  simType: SIM_TYPE;
  orderType: number;
}

export interface ParamsOnlineOrdersCSManagement {
  page: number;
  size: number;
  q: string | undefined;
  partner: string | undefined;
  status: string | undefined;
  channel: string | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
}

export const paramsDefault: ParamsOnlineOrdersCSManagement = {
  page: 0,
  size: 20,
  q: undefined,
  partner: undefined,
  status: undefined,
  channel: undefined,
  fromDate: undefined,
  toDate: undefined,
};

export const defaultPageSizeOptions = [20, 50, 100];
export interface Req {
  process_code: number[];
  status: number[];
  status_last: number[];
  from_date: string;
  to_date: string;
  page: number;
  size: number;
}

export interface ParamsCencelOnlineOrdersCS {
  id: number;
  note: string;
}

export enum IOrderCSStatus {
  CREATED = 0,
  WAITING = 1,
  DELIVERING = 2,
  DELIVERED = 3,
  DELIVERY_FAILED = 4,
  RETURNING_ORDER = 5,
  RETURNED_ORDER = 6,
  CANCELED_ORDER = 7,
  COMBINED_KIT_ERROR = 8,
}

export enum IOrderCSPaymentStatus {
  NOT_PAID = 0,
  PAID = 1,
  PAYING = 2,
}

export interface IParamsUserRefund {
  q: string;
  page: number;
  size: number;
}

export interface ParamsRefundOrderCS {
  id: number;
  receiveUser: string[];
}

export interface IParamsSenQReSIM {
  id: number;
  serial: number;
  email: string;
}
export enum IOrderType {
  DOI_SIM = 3,
  ONLINE_ORDER = 2,
  SIM_OUTBOUND = 6,
}