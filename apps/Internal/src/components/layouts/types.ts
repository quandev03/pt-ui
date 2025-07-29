import { IPage } from '@react/commons/types';

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  sendDate: string;
  seen: boolean;
}

export interface DataNotify {
  data: NotificationItem[];
  totalNotSeen: number;
}

export interface IParamItem {
  label: string;
  value: string;
}

export interface IAllParamResponse {
  CLIENT_TYPE: IParamItem[];
  GENDER: IParamItem[];
  SALE_ORDER_STATUS: IParamItem[];
  SALE_ORDER_APPROVAL_STATUS: IParamItem[];
  PRODUCT_CATEGORY_CATEGORY_TYPE: IParamItem[];
}

export interface IUserInfo {
  username?: string;
  gender?: string;
  dateOfBirth?: string;
  idCardNo?: string;
  code?: string;
  fullname?: string;
  phoneNumber?: string;
  type?: string;
  organization?: string;
  position?: string;
  needChangePassword?: boolean;
  createdDate?: string;
  //thucnv
  id: string;
  groups: any[];
  roles: any[];
  departments: any[];
  email: string;
}

export type UserCatalogResponse = {
  data: IPage<IUserInfo>;
};

export type GetALLData = {
  id: string;
  code: string;
  name: string;
  username: string;
  fullname: string;
  status: 0 | 1;
};

export type AllUserType =
  | { isPartner: true; clientIdentity: string }
  | { isPartner: false };
export interface ICriteriaItem {
  id: number;
  type: string;
  code: string;
  name: string;
  dataType: string | null;
  value: string;
  status: string;
}

export interface ExportRequest {
  uri: string;
  filename?: string;
}

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
  CHANGE_SIM_ONLINE_DELIVERY_METHOD: IOption[];
  CHANGE_SIM_ONLINE_RECEIVE_METHOD: IOption[];
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
  STOCK_MOVE_LOOK_UP_MOVE_TYPE: IOption[];
  SALE_ORDER_PAYMENT_OPTION: IOption[];
  REASON_TYPE_ID: IOption[];
  SALE_ORDER_DELIVERY_STATUS: IOption[];
  SALE_ORDER_DELIVERY_PARTNER_CODE: IOption[];
  PROMOTION_PROGRAM_PROM_METHOD: IOption[];
  DELIVERY_REPORT_DELIVERY_STATUS: IOption[];
  SALE_ORDER_DELIVERY_METHOD: IOption[];
};

export type IOption = {
  label: string;
  value: number | string;
};

export interface IOptionProductCategory {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate?: any;
  id: number;
  tableName: string;
  columnName: string;
  code: string;
  value: string;
  valueType?: any;
  refId?: any;
  status: number;
}

export interface INotification {
  id: string;
  title: string;
  content: string;
  sendDate: string;
  seen: boolean;
  uriRef: string;
  props: string;
  clientId: string;
  clientCode: string;
  receiverId: string;
  receiverPreferredUsername: string;
}

export interface INotificationParams {
  page?: number;
  limit?: number;
  lastNotificationId?: string;
  seen?: boolean;
}

export interface IPageNotification {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}
