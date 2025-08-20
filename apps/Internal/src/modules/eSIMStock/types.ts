import { IParamsRequest } from '@vissoft-react/common';

export interface IeSIMStockItem {
  activeStatus: number;
  genQrBy: string;
  isdn: number;
  modifiedDate: string;
  orderNo: string;
  orgCode: string;
  packCode: string;
  serial: string;
  status: number;
  status900: number;
  subId: string;
}

export interface IeSIMStockParams extends IParamsRequest {
  packageName?: string;
  orgCode?: string;
  subStatus?: string;
  activeStatus?: string;
  textSearch?: string;
}

export interface IeSIMStockDetail {
  actionCode: string;
  actionDate: string;
  createdBy: string;
  createdDate: string;
  description: string;
  empCode: string;
  empName: string;
  id: string;
  reasonCode: string;
  reasonNote: string;
  shopCode: string;
  subId: string;
}

export interface IPackage {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: string;
  pckCode: string;
  pckName: string;
  packagePrice: number;
  status: number;
  description: string;
}

export interface IOrgItem {
  id: string;
  orgCode: string;
  orgName: string;
  parentId: string;
  createdBy: string;
}

export enum ActiveStatusEnum {
  NOT_BLOCKED = 1,
  BLOCKED_ONE_WAY = 11,
}

export const ActiveStatusColor = {
  [ActiveStatusEnum.NOT_BLOCKED]: 'success',
  [ActiveStatusEnum.BLOCKED_ONE_WAY]: 'error',
};

export interface ICustomerInfo {
  birthOfDate: string | null;
  contractCode: string | null;
  customerCode: string | null;
  fullName: string | null;
  gender: number;
  idNoExpireDate: string | null;
  idNumber: string | null;
  issuePlace: string | null;
  nationality: string | null;
  typeDocument: string | null;
}
export enum GenderEnum {
  MALE = 0,
  FEMALE = 1,
}

export enum SubscriberStatusEnum {
  IN_STOCK = 0,
  SOLD = 1,
  CALLED_900 = 2,
  UPDATED_TTTB = 3,
}
export const SubscriberStatusColor = {
  [SubscriberStatusEnum.IN_STOCK]: 'warning',
  [SubscriberStatusEnum.CALLED_900]: 'purple',
  [SubscriberStatusEnum.UPDATED_TTTB]: 'blue',
  [SubscriberStatusEnum.SOLD]: 'success',
};
