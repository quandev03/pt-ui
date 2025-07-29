import { FileData } from '@react/commons/TableUploadFile';

export interface ProductType {
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
  quantity?: number;
}

export interface MerchantTransType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orderNo: string;
  fromOrgName: string;
  toOrgName: string;
  approvalStatus: number;
  supplierName: string;
  orderStatus: number;
  status: number;
}

export interface FileType extends FileData {
  name: string;
}
