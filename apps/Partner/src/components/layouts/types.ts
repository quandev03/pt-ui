export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  sendDate: string;
  seen: boolean;
}

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
}

export interface IUserInfo {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  username: string;
  fullname: string;
  status: number;
  type: string;
  loginMethod: number;
  phoneNumber: string;
  gender: number;
  needChangePassword: boolean;
  groups: any[];
  roles: any[];
  client: Client;
  attributes: Attributes;
  name: string;
  email: string;
}

export interface Client {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  code: string;
  name: string;
  contactName: any;
  contactPosition: any;
  contactEmail: any;
  contactPhone: any;
  permanentAddress: any;
  permanentProvinceId: any;
  permanentDistrictId: any;
  permanentWardId: any;
  status: number;
}

export interface Attributes {}

export interface IPartnerInfor {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: string;
  orgCode: string;
  orgName: string;
  orgType: string;
  orgSubType: string;
  orgDescription: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  address: string;
  status: number;
  taxCode: string;
  contractNo: string;
  contractDate: string;
  representative: string;
  phone: string;
  email: string;
  orgPartnerType: string;
  orgBankAccountNo: string;
  contractNoFileUrl: string;
  businessLicenseFileUrl: string;
  businessLicenseNo: string;
  businessLicenseAddress: string;
  deliveryInfos: IDeliveryInfo[];
  contractNoFileLink: string;
  businessLicenseFileLink: string;
  clientId: string;
  phoneOrganizationDeliveryInfoDTO: string;
}

export interface IDeliveryInfo {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orgId: number;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  address: string;
  consigneeName: string;
  orgTitle: string;
  idNo: string;
  idDate: string;
  idPlace: string;
  idCardFrontSiteFileUrl: string;
  idCardBackSiteFileUrl: string;
  multiFileUrl: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  passportNo: string;
  status: string;
  idCardFrontSiteFileLink: string;
  idCardBackSiteFileLink: string;
  multiFileLink: string;
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
  DELIVERY_ORDER_APPROVAL_STATUS: IOption[];
  STOCK_PRODUCT_SERIAL_STATUS: IOption[];
  STOCK_PRODUCT_SERIAL_KIT_STATUS: IOption[];
  COMBINE_KIT_PROCESS_TYPE: IOption[];
  COMBINE_KIT_ISDN_TYPE: IOption[];
  COMBINE_KIT_STATUS: IOption[];
  SALE_ORDER_PAYMENT_OPTION: IOption[];
  STOCK_PRODUCT_SERIAL_PARTNER_KIT_STATUS: IOption[];
};

export type IOption = {
  label: string;
  value: number | string;
};
export type GetALLData = {
  id: string;
  code: string;
  name: string;
  username: string;
  fullname: string;
  status: 0 | 1;
};
