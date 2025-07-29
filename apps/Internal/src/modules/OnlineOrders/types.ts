import { AnyElement } from '@react/commons/types';

export enum SIM_TYPE {
  NORMAL = 'SIM vật lý',
  ESIM = 'eSIM',
}

export interface IOnlineOrdersManagement {
  id: number;
  orderNo: string;
  deliveryTransCode: string;
  channel: string;
  amountTotal: number;
  orderTime: string;
  deliveryStatus: number;
  deliveryStatusName: string;
  deliveryPartnerName: string;
  deliveryPartnerCode: string;
  note: string;
  quantity: number;
  paymentMethodName: string;
  deliveryFee: number;
  cancelTime: string;
  cancelUser: string;
  cancelReason: string;
  deliveryMethod: string;
  deliveryMethodName: string;
  partnerDeliveryFee: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  ward?: string;
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  address?: string;
  simType: SIM_TYPE;
  esimCount: number;
}

export interface ParamsOnlineOrdersManagement {
  page: number;
  size: number;
  q: string | undefined;
  partner: string | undefined;
  status: string | undefined;
  channel: string | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
}

export const paramsDefault: ParamsOnlineOrdersManagement = {
  page: 0,
  size: 20,
  q: undefined,
  partner: undefined,
  status: undefined,
  channel: undefined,
  fromDate: undefined,
  toDate: undefined,
};

export interface IDetailOnlineOrder {
  id: number;
  orderNo: string;
  channel: string;
  customerName: string;
  customerPhone: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  orderTime: string;
  deliveryStatus: number;
  deliveryStatusName: string;
  deliveryPartnerCode: string;
  deliveryPartnerName: string;
  amountTotal: number;
  deliveryMethod: string;
  deliveryMethodName: string;
  deliveryFee: number;
  partnerDeliveryFee: number;
  weight: number;
  partnerWeight: number;
  discountAmount: number;
  productAmount: number;
  vat: number;
  quantity: number;
  codAmount: number;
  paymentMethodName: string;
  products: IProductOnlineOrder[];
  simType: SIM_TYPE;
}

export interface IProductOnlineOrder {
  serial: number;
  isdn: string;
  packageName: string;
  niceNumberFee: number;
  simTypeName: string;
  period: string;
  coverageRange?: string;
}

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

export interface IRequest {
  shippingUnit: number;
  shippingMethod: number;
  customerName: string;
  customerPhone: string;
  email: string;
  address: string;
  districtCode: string;
  wardCode: string;
}

export interface IPayloadOnlineOrder {
  request: IRequest;
}

export type IPayloadOnlineOrderForm = Pick<
  IRequest,
  | 'shippingUnit'
  | 'shippingMethod'
  | 'customerName'
  | 'customerPhone'
  | 'email'
  | 'address'
  | 'districtCode'
  | 'wardCode'
>;

export interface IOnlineOrderProducts {
  key?: string | number;
  serial?: string | number;
  isdn?: string | number;
  packageName?: string;
  niceNumberFee?: string | number;
  isdnFee?: string | number;
  simTypeName?: string;
  period?: string;
  skuId?: string;
  usingDay?: string;
  coverageRange?: string;
  id?: string;
  note?: string;
}

export const onlineOrderProductsDefault: IOnlineOrderProducts = {
  serial: '',
  isdn: '',
  packageName: '',
  niceNumberFee: '',
  simTypeName: '',
  period: '',
};

export interface IResponseCreateOrder {
  orderNo: string;
  deliveryOrderNo: string;
  status: number;
}

export interface IPayloadUpdateOrder {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  district?: string;
  ward?: string;
  address?: string;
  deliveryPartner: string;
  deliveryMethod: string;
  details: AnyElement;
}

export interface ISelectDVVC {
  isOpen: boolean;
  data?: IOnlineOrdersManagement;
}

export interface IResponseGetFee {
  amount: number;
}

export enum IOrderOnlinetatus {
  CREATED = 0,
  WAITING = 1,
  DELIVERING = 2,
  DELIVERED = 3,
  DELIVERY_FAILED = 4,
  RETURNING_ORDER = 5,
  RETURNED_ORDER = 6,
  CANCELED_ORDER = 7,
  COMBINED_KIT_ERROR = 8,
  NEW_CREATION_FAILED = 9,
}
export enum TypeChannel {
  WebSIMOutbound = 'Web SIM outbound',
}
export interface IOnlineOrderProductsSim {
  id: string;
  skuId: string;
  usingDay: string;
}

export enum TypeSim {
  Physical = 'SIM vật lý',
  ESIM = 'eSIM',
}