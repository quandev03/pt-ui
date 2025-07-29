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
  fromSerial?: number;
  toSerial?: number;
}

export interface MerchantNoteType {
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
  deliveryNoteCode: string;
  deliveryNoteLines: any[];
  deliveryNoteLineDTOList: any[];
  toOrgId: string;
  deliveryNoteDate: string;
  deliveryNoteMethod: number;
  status: number;
}

export interface FileType extends FileData {
  name: string;
}
