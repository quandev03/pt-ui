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

export interface MerchantOrderType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  fromOrgName: string;
  toOrgName: string;
  approvalStatus: number;
  supplierName: string;
  orderStatus: number;
  deliveryOrderLineDTOS: any[];
  orderNo: string;
  orderDate: string;
  toOrgId: number;
  reasonId: number;
  reasonName: number;
}

export interface FileType extends FileData {
  name: string;
}
