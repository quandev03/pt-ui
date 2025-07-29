import { AnyElement } from '@react/commons/types';
import { ColorList } from '@react/constants/color';

export interface IStockType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: string;
  tableName: string;
  columnName: string;
  code: number;
  value: string;
  valueType?: string;
  refId?: string;
  status: number;
}
export interface IParamsPhoneNoCatalog {
  page?: number;
  size?: number;
  status?: string;
  parentId?: string;
}
export interface IListPhoneNoCatalog {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: string;
  parentId: number | null;
  stockCode: string;
  stockName: string;
  stockType: number;
  status: number | null;
  description: string | null;
  stockIsdnOrgPermissionDTOS: Array<{
    id: number;
    stockId: number;
    userId: string;
    userName: string;
  }> | null;
  children: IListPhoneNoCatalog[];
  salesChannels: string;
}
export interface IDataPayloadPhoneNoCatalog {
  id?: string;
  parentId: number;
  stockCode: string;
  stockName: string;
  stockType: number;
  status: number;
  description: string;
  stockIsdnOrgPermissionDTOS: Array<{
    id?: number;
    stockId?: number;
    userId: string;
    userName: string;
  }>;
  salesChannels?: AnyElement;
}
export interface ISaleChannels {
  channelCode: string;
  channelName: string;
  status: boolean;
}
export enum StockTypeEnum {
  GENERAL_WAREHOUSE = 1,
  PURPOSE_WAREHOUSE = 2,
  SELL_WAREHOUSE = 3,
  WAIT_FOR_CANCELLATION_WAREHOUSE = 5,
  REFUND_AND_CANCEL_WAREHOUSE = 4,
}

export const mappingColor = {
  '1': ColorList.SUCCESS,
  '0': ColorList.WAITING,
};

export type TableType = {
  userId: string;
  userName: string;
  userFullName: string;
};
