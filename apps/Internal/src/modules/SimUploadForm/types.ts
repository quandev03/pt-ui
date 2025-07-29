import { IParamsRequest } from '@react/commons/types';

export interface ISimUploadFormParams extends IParamsRequest {
  searchPoOrUploadOrderNo?: string;
  approvalStatus?: string;
  orderStatus?: string;
  startDate: string;
  endDate: string;
}
export interface ISimUploadFormItem {
  createdBy: string;
  createdDate: string;
  modifiedBy: string | null;
  modifiedDate: string | null;
  id: number;
  uploadOrderNo: string;
  deliveryOrderNo: string;
  amountNumber: number;
  approvalStatus: number;
  orderStatus: number;
}

export interface IProductItem {
  id: number;
  deliveryOrderId: number;
  orderDate: string;
  productId: number;
  fromSerial: string;
  toSerial: string;
  quantity: number;
  deliveriedQuantity: number;
  productCode: string;
  categoryName: string;
  categoryType: number;
  productName: string;
  productUom: string;
  remainingAmount: number;
  amountNumber: number;
}

export interface IOrderItem {
    id: number,
    orderNo: string,
    supplierName: string
}

export interface OrderLinePayload {
  amountNumber: number | undefined;
  productId: number;
}

export interface OrderLine {
  id: number;
  productCode: string;
  uploadOrderId: number;
  deliveryOrderLineId: number;
  amountNumber: number;
  productCategoryName: string;
  productCategoryType: number;
  productName: string;
  productId: number;
  fromSerial: number;
  toSerial: number;
  remainingAmount: number;
}

export interface Attachment {
  id: number;
  recordId: number;
  objectName: string;
  fileName: string;
  fileUrl: string;
  fileVolume: number;
  description: string;
  createdBy: string;
  createdDate: string;
  multipartFile: string;
}

export interface IUploadFormItem {
  id: number;
  deliveryOrderId: number;
  deliveryOrderNo: string;
  description: string;
  orderStatus: number;
  approvalStatus: number;
  amountNumber: number;
  uploadOrderNo: string;
  approvalOrgId: number;
  orderLines: OrderLine[];
  attachments: Attachment[];
  supplierName: string;
}

export interface IApprovalProcessPayload {
  recordId: number;
  objectName: string;
}

export interface IApprovalInfo {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  approvalStepId: number | null;
  approvedDate: string;
  status: number;
  approvedUserId: string;
  description: string;
  approvalHistoryId: number;
  stepOrder: number;
  approvedUserName: string;
  mandatorUserId: string | null;
  mandatorUserName: string | null;
}

export enum ApprovedStatusEnum {
  PENDING = '1',
  APPROVING = '2',
  APPROVED = '3',
  REJECT = '4',
}
export enum FormStatusEnum {
  PENDING = '1',
  PROCESSING = '2',
  SUCCESS = '3',
  CANCEL = '4',
}
