import { ACTION_MODE_ENUM } from '@react/commons/types';
import { IOption } from '../../components/layouts/types';

export interface AddEditViewProps {
  actionMode: ACTION_MODE_ENUM;
}

export interface OrderType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orgName: string;
  orderNo: string;
  totalAmount: number;
  orderStatus: number;
  approvalStatus: number;
}

export interface KitBatchType {
  amount: number;
  fromSerial: number;
  toSerial: number;
}
export interface KitCraftType {
  id: number;
  processType: number;
  orderNo: string;
  status: number;
  totalNumber: number;
  failedNumber: number;
  succeededNumber: number;
  logFileUrl: string;
  createdBy: string;
  createdTime: string;
}

export interface ProductType {
  productId: number;
  productName: string;
  simType: string;
  packageProfileId: number;
  packageProfileCode: string;
  bufferPackageId: number;
  bufferPackageCode: string;
  amount: number;
  fromSerial: number;
  toSerial: number;
  orgId: number;
  stockId: number;
  profileTypeList: IOption[];
  file: Blob;
}

export enum KitCraftStatus {
  REFUSE = 0,
  APPROVAl = 1,
}
