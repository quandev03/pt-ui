export enum ORDER_TYPE_ENUM {
  ONLINE_ORDER = 2,
  CHANGE_SIM = 3,
}

export interface IOnlineOrderAtStoreManagement {
  id: number;
  orderNo: string;
  store: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderTime: string;
  productAmount: number;
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
  simType: string;
  orderType: ORDER_TYPE_ENUM;
}

export interface ParamsOnlineOrderAtStoreManagement {
  page: number;
  size: number;
  q: string | undefined;
  partner: string | undefined;
  status: string | undefined;
  channel: string | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
}

export const paramsDefault: ParamsOnlineOrderAtStoreManagement = {
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

export interface ParamsCancelOnlineOrderAtStore {
  id: number;
  note: string;
}

export interface ParamsRefundOnlineOrderAtStore {
  id: number;
  receiveUser: string[];
}

export enum IOrderOnlineStatus {
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

export enum IOrderOnlinePaymentStatus {
  NOT_PAID = 0,
  PAID = 1,
  PAYING = 2,
}

export interface IParamsUserRefund {
  q: string;
  page: number;
  size: number;
}
