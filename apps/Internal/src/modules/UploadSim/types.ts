export interface IUploadSimParams {
  startDate: string;
  endDate: string;
  page: number;
  size: number;
}

export interface ContentItem {
  id: number;
  stockProductUploadOrderCode: string;
  validSucceedNumber: number;
  validFailedNumber: number;
  succeedNumber: number;
  failedNumber: number;
  validFileUrl: string;
  fileResultUrl: string;
  status: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface ProductItem {
  id: number;
  productCode: string;
  uploadOrderId: number;
  deliveryOrderLineId: number;
  amountNumber: number;
  productCategoryName: string;
  productCategoryType: number;
  productName: string;
  productId: number;
}

export interface ExportRequest {
  uri: string;
  filename?: string;
  params?: any;
}
