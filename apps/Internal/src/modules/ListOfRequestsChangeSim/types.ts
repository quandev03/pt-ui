import { IParamsRequest } from '@react/commons/types';

export enum ReceiptMethodType {
  SHOP = 'STORE',
  HOME = 'HOME',
}

export interface IParamsPostCheckList extends IParamsRequest {
  isdn?: string;
  status?: string;
  requestType?: string;
  payStatus?: string;
  fromDate?: string;
  toDate?: string;
  isCallApi?: string;
}

export interface IPostCheckList {
  id: string;
  customerCode: string;
  userName: string;
  createdBy: string;
  birthDate: string;
  contractNo: string;
  phoneNumber: string;
  idType: string;
  idNo: string;
  idIssueDate: string;
  custType: string;
  customerStatus: string;
  auditStatus: string; // 0: Chưa duyệt, 1: Đã duyệt, 2: Từ chối
  docUpdateStatus: string;
  assignStatus: string;
  assignUserName: string;
  preApprovalUserName: string;
  createdDate: string;
  modifiedDate: string;
}

export enum PayStatusEnum {
  WAITING_PAY = 0,
  PAID = 1,
  PAY_FAILED = 2,
}
export enum DocumentTypeEnum {
  CCCD = '1',
  CMND = '2',
}
export interface IPayloadReject {
  id?: string;
  requestSimType?: string;
  newSerial?: string;
  reasonCode?: string;
  receiverName?: string;
  phoneNumber?: string;
  deliveryMethod?: string;
  receiverAddress?: string;
  receiverProvince?: string;
  rejectReasonCode?: string;
  note?: string;
  receiptMethod?: string;
  storeAddress?: string;
  stockId?: string;
  lpaData?: string;
  receiverPhone?: string;
}
export enum OrgSubTypeEnum {
  DECENTRALIZED_WAREHOUSE = "DECENTRALIZED_WAREHOUSE"
}

export enum OrganizationUnitTypeEnum {
  HEADQUARTERS = '00', // Trụ sở chính
  DEPARTMENT = '01', // Phòng ban
  CENTER = '02', // Trung tâm
  BRANCH = '03', // Chi nhánh
  STORE = '04', // Cửa hàng
  SIM_OUTBOUND = '05', // SIM outbound
  ESIM_ONLINE = '06', // Đổi eSIM online
}