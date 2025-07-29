import { FileData } from '@react/commons/TableUploadFile';

export interface IDiscountManagement {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  stt: string | number;
  id: string | number;
  discountCode: string;
  discountName: string;
  fromDate: string;
  toDate: string;
  status: string | number;
}

export interface ParamsDiscountManagement {
  page: number;
  size: number;
  quickSearch: string | undefined;
  status: string | undefined;
  duration: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
}

export const paramsDefault: ParamsDiscountManagement = {
  page: 0,
  size: 20,
  quickSearch: undefined,
  status: undefined,
  duration: undefined,
  startDate: undefined,
  endDate: undefined,
};

export interface IDiscountDetail {
  id?: number;
  discountId?: number;
  fromValue: number;
  toValue: number;
  discountDetailLines: DiscountDetailLine[];
}

export interface DiscountDetailLine {
  id?: number;
  discountDetailId?: number;
  discountType: number | null;
  formDiscount: number | null;
  discountValue: number;
}

export interface IAttachments {
  id: string | number;
  recordId: string | number;
  objectName: string;
  fileName: string;
  fileUrl: string;
  fileVolume: string | number;
  description: string;
  createdDate: any;
  createdBy: string;
}

export const attachmentsDefault: IAttachments = {
  id: '',
  recordId: '',
  objectName: '',
  fileName: '',
  fileUrl: '',
  fileVolume: '',
  description: '',
  createdDate: '',
  createdBy: '',
};

export interface IDetail {
  id?: string;
  discountCode: string;
  discountName: string;
  calType: number;
  discountType: number;
  status: string | number | null;
  fromDate: string;
  toDate: string;
  docNo: string | null;
  description: string | null;
  orgType: string | number;
  orgIds: any[];
  productCategoryId: string | number;
  productIds: any[];
  discountDetails: IDiscountDetail[];
  attachments: IAttachments[];
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
  discountCode: string;
  discountName: string;
  calType: number;
  discountType: number;
  status: number;
  fromDate: string;
  toDate: string;
  docNo: string;
  description: string;
  orgType: string;
  orgIds: string[] | number[];
  productCategoryId: number;
  productIds: string[] | number[];
  discountDetails: IDiscountDetail[];
  attachments: IAttachments[];
}

export interface IPayloadDiscount {
  request: IRequest;
  files: string[];
}

export type IPayloadDiscountForm = Pick<
  IRequest,
  | 'discountCode'
  | 'discountName'
  | 'calType'
  | 'discountType'
  | 'fromDate'
  | 'toDate'
  | 'orgType'
  | 'orgIds'
  | 'productCategoryId'
  | 'productIds'
  | 'description'
  | 'discountDetails'
> & { files: FileData[] };
