// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { ActionsTypeEnum } from '@react/constants/app';
import { ReactNode } from 'react';
import type { RcFile as OriRcFile } from 'rc-upload/lib/interface';

export type AnyElement = any;

export interface IPage<T> {
  content: T[];
  pageable: IPageable;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  sort: ISort;
  last: boolean;
  first: boolean;
  empty: boolean;
  totalUnseen?: number;
}

export interface ISort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface IPageable {
  sort: ISort;
  offset: number;
  pageSize: number;
  pageNumber: number;
  unpaged: boolean;
  paged: boolean;
}

export interface IParamsRequest {
  page: number;
  size: number;
  q?: string;
  status?: string;
  filters?: string[];
}

export interface IFieldErrorsItem {
  field: string;
  detail: string;
}

export interface IFieldErrorsItemCustom {
  input: AnyElement;
  loc: AnyElement[];
  msg: string;
  type: string;
  url: string;
}

export interface IErrorResponse {
  detail: string;
  message: string;
  error?: string;
  path?: string;
  status: number;
  title: string;
  type: string;
  code?: string;
  errors: IFieldErrorsItem[];
}

export interface MenuItemConfig {
  titleId: string;
  uri?: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

export enum ModelStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export type IModeAction =
  | 'Create'
  | 'Edit'
  | 'View'
  | 'Delete'
  | 'Approved'
  | 'History'
  | 'Implement'
  | 'Copy'
  | 'Reject'
  | '';

export enum ApprovalObject {
  ORGANIZATION_UNIT = 'ORGANIZATION_UNIT',
  DELIVERY_ORDER = 'DELIVERY_ORDER',
  ISDN_TRANSACTION = 'ISDN_TRANSACTION',
  SALE_ORDER = 'SALE_ORDER',
  DELEVERY_ORDER = 'DELEVERY_ORDER',
  STOCK_PRODUCT_UPLOAD_ORDER = 'STOCK_PRODUCT_UPLOAD_ORDER',
  AIR_TIME_TRANSACTION = 'AIR_TIME_TRANSACTION',
}

export enum ApprovalProcessCode {
  NUMBER_DISTRIBUTION = 'NUMBER_DISTRIBUTION',
  TRANSFER_WAREHOUSE = 'TRANSFER_WAREHOUSE',
  BACK_NUMBER = 'BACK_NUMBER',
  UPLOAD_NUMBER = 'UPLOAD_NUMBER',
}

//dùng để check status trả ra từ api
export enum ACTION_MODE_ENUM {
  CREATE = 'CREATE',
  EDIT = 'UPDATE',
  VIEW = 'READ',
  Delete = 'DELETE',
  Approved = 'Approved',
  History = 'History',
  Implement = 'Implement',
  Copy = 'Copy',
  Reject = 'Reject',
  Cancel = 'Cancel',
  Finish = 'Finish',
  DebtDetail = 'DebtDetail',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  PARTNER_USER_MANAGER = 'PARTNER_USER_MANAGER', // Quản lý user đối tác danh mục đối tác
  PHONE_NO_STOCK_AUTHORIZATION = 'PHONE_NO_STOCK_AUTHORIZATION', // Phân quyền kho số màn danh mục đối tác
  PRODUCT_AUTHORIZATION = 'PRODUCT_AUTHORIZATION', // Phân quyền sản phẩm danh mục đối tác
  VIEW_APPROVAL_PROGRESS = 'VIEW_APPROVAL_PROGRESS',
  VIEW_APPROVAL_PROCESS = 'VIEW_APPROVAL_PROCESS', // Tiến độ phê duyệt
}

export interface IPageRequestListTable extends IParamsRequest {
  domain: string;
}

export interface IStrPage<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface IStrError {
  success: boolean;
  code: number;
  message: string;
  error: string;
}

export interface OptionsType {
  label: string;
  value: string;
}

export interface MenuItem {
  key: string;
  icon?: ReactNode;
  label: string;
  uri?: string;
  parentId?: string;
  hasChild?: boolean;
  actions?: string[];
}

export interface BreadcrumbMenuItem extends MenuItem {
  isAction?: boolean;
  isText?: boolean;
}

export interface MenuObjectItem {
  code: string;
  name: string;
  uri: string;
  items: MenuObjectItem[];
  actions: ActionsTypeEnum[];
}

export interface IResCatalogService<T> {
  data: T[];
  status: {
    code: string;
    message: string;
    responseTime: string;
    displayMessage: string;
    properties: any;
  };
}

export type CommonError = {
  type: string;
  title: string;
  status: number;
  detail: string;
  code: string;
  data: any;
  errors: FieldErrorsType[];
  //trường hợp 404
  error?: string;
};

export interface FieldErrorsType {
  field: string;
  detail: string;
}

export enum CriteriaType {
  BIRTH_DIFFIRENT = 'Tiêu chí 3',
  CCCD_BIRTH_DIFF = 'Tiêu chí 7',
  CMND_PLACE_DIFF = 'Tiêu chí 8',
  IDNO_LENGTH_9_12 = 'Tiêu chí 5',
  IDNO_SPECIAL = 'Tiêu chí 4',
  MAX_SUBSCRIBER = 'Tiêu chí 6',
  NAME_DIFFIRENT = 'Tiêu chí 2',
  NAME_MAX30 = 'Tiêu chí 1',
}

export interface RcFile extends OriRcFile {
  readonly lastModifiedDate: Date;
}

export type PDFFile = string | File | null;

export type IOption = {
  label: string;
  value: number | string;
};

export type ParamsOption = {
  PRODUCT_PRODUCT_UOM: IOption[];
  STOCK_ISDN_ORG_STOCK_TYPE: IOption[];
  PRODUCT_CATEGORY_CATEGORY_TYPE: IOption[];
  SALE_ORDER_STATUS: IOption[];
  PACKAGE_PROFILE_REG_TYPE: IOption[];
  PACKAGE_PROFILE_PCK_TYPE: IOption[];
  SUB_DOCUMENT_AUDIT_STATUS: IOption[];
  PACKAGE_PROFILE_PROFILE_TYPE: IOption[];
  ORGANIZATION_UNIT_ORG_SUB_TYPE: IOption[];
  SUBSCRIBER_ACTIVE_REQUEST_APPROVE_STATUS: IOption[];
  ISDN_TRANSACTION_TRANS_TYPE: IOption[];
  SALE_ORDER_SHIPPING_METHOD: IOption[];
  PACKAGE_PROFILE_GROUP_TYPE: IOption[];
  SUBSCRIBER_ACTIVE_STATUS: IOption[];
  APPROVAL_HISTORY_STEP_STATUS: IOption[];
  APPROVAL_PROCESS_PROCESS_CODE: IOption[];
  SALE_ORDER_PAYMENT_METHOD: IOption[];
  SALE_ORDER_APPROVAL_STATUS: IOption[];
  SUB_DOCUMENT_APPROVAL_STATUS: IOption[];
  APPROVAL_HISTORY_STATUS: IOption[];
  COMBINE_KIT_PROCESS_TYPE: IOption[];
  COMBINE_KIT_STATUS: IOption[];
  PARTNER_STATUS: IOption[];
  PARTNER_APPROVAL_STATUS: IOption[];
  PARTNER_TYPE: IOption[];
  PARTNER_SUB_TYPE: IOption[];
  STOCK_PRODUCT_SERIAL_KIT_STATUS: IOption[];
  STOCK_PRODUCT_SERIAL_STATUS: IOption[];
  DELIVERY_ORDER_APPROVAL_STATUS: IOption[];
  DELIVERY_ORDER_ORDER_STATUS: IOption[];
  STOCK_MOVE_STATUS: IOption[];
  DELIVERY_NOTE_STATUS: IOption[];
  DELIVERY_NOTE_DELIVERY_NOTE_METHOD: IOption[];
  STOCK_MOVE_MOVE_METHOD: IOption[];
  COMBINE_KIT_SIM_TYPE: IOption[];
  DELIVERY_FEE_PAYMENT_METHOD: IOption[];
  DELIVERY_FEE_DELIVERY_METHOD: IOption[];
  CHANGE_SIM_BULK_PROCESS_STATUS: IOption[];
  SERVICE_SHIPPING_METHOD: IOption[];
  STOCK_PRODUCT_UPLOAD_ORDER_APPROVAL_STATUS: IOption[];
  STOCK_PRODUCT_UPLOAD_ORDER_ORDER_STATUS: IOption[];
  INTERNAL_DEPARTMENT: IOption[];
  COMBINE_KIT_KIT_STATUS: IOption[];
  COMBINE_KIT_ISDN_TYPE: IOption[];
  ISDN_TRANSACTION_TRANS_STATUS: IOption[];
  ISDN_TRANSACTION_APPROVAL_STATUS: IOption[];
  STOCK_ISDN_TRANSFER_STATUS: IOption[];
  DELIVERY_PROGRAM_PROMOTION_CHANNEL: IOption[];
  DELIVERY_PROGRAM_PROMOTION_DELIVERY_PAYMENT_METHOD: IOption[];
  DELIVERY_PROGRAM_PROMOTION_DELIVERY_METHOD: IOption[];
  STOCK_MOVE_MOVE_TYPE: IOption[];
  DISCOUNT_DETAIL_LINE_DISCOUNT_TYPE: IOption[];
  DISCOUNT_DETAIL_LINE_FORM_DISCOUNT: IOption[];
  SIM_REGISTRATION_TRANS_TRANS_STATUS: IOption[];
  PARAMETER_CONFIG_DATATYPE: IOption[];
  AIRTIME_TRANSACTION_APPROVAL_STATUS: IOption[];
  STOCK_ISDN_STATUS: IOption[];
  ORGANIZATION_UNIT_SALES_CHANNELS: IOption[];
  PROMOTION_PROGRAM_PROGRAM_SERVICE: IOption[];
  SALE_ORDER_PAY_STATUS: IOption[];
  PROMOTION_PROGRAM_PROM_METHOD: IOption[];
  PROMOTION_PROGRAM_USER_LIMIT: IOption[];
  STOCK_PRODUCT_SERIAL_PARTNER_KIT_STATUS: IOption[];
  BATCH_PACKAGE_SALE_STATUS: IOption[];
  SALE_ORDER_STORE_STATUS: IOption[];
  SALE_ORDER_DELIVERY_METHOD: IOption[];
  SALE_ORDER_DELIVERY_PARTNER_CODE: IOption[];
  PROCESS_STATUS_STATUS: IOption[];
  PROMOTION_PROGRAM_PROMOTION_TYPE: IOption[];
  PROMOTION_PROGRAM_PROMOTION_PRODUCT: IOption[];
  PROMOTION_PROGRAM_SIM_TYPE: IOption[];
  PROMOTION_PROGRAM_LINE_PROMOTION_TYPE: IOption[];
};
