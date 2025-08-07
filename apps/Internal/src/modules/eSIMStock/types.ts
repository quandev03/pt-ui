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
  BLOCKED_ONE_WAY_REQUEST = 10,
  BLOCKED_TWO_WAY_REQUEST = 20,
  BLOCKED_ONE_WAY_NETWORK = 11,
  BLOCKED_TWO_WAY_NETWORK = 21,
}

export const ActiveStatusLabel: Record<ActiveStatusEnum, string> = {
  [ActiveStatusEnum.NOT_BLOCKED]: 'Không bị chặn',
  [ActiveStatusEnum.BLOCKED_ONE_WAY_REQUEST]: 'Chặn một chiều do yêu cầu',
  [ActiveStatusEnum.BLOCKED_TWO_WAY_REQUEST]: 'Chặn hai chiều do yêu cầu',
  [ActiveStatusEnum.BLOCKED_ONE_WAY_NETWORK]: 'Chặn một chiều do nhà mạng',
  [ActiveStatusEnum.BLOCKED_TWO_WAY_NETWORK]: 'Chặn hai chiều do nhà mạng',
};
