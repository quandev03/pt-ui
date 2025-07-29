import { AnyElement } from '@react/commons/types';
import { ColorList } from '@react/constants/color';
import { Key } from 'react';

export interface IVerificationItem {
  subscriberId: number;
  subDocumentId: number;
  phoneNumber: number;
  customerCode: string;
  userName: string | null;
  createdBy: string;
  birthDate: string;
  contractNo: string;
  activeChannel: string | null;
  idType: string;
  idNo: string;
  idIssueDate: string;
  custType: string;
  customerStatus: string;
  approveStatus: number;
  docUpdateStatus: number | null;
  auditStatus: number | null;
  assignStatus: number;
  assignUserName: string;
  createdDate: string;
  modifiedDate: string;
  approveRejectReasonCode: string | null;
  packagePlan: string;
  clientName: string | null;
  [key: string]: AnyElement;
}
export interface IVerificationParams {
  page: number;
  size: number;
  type: number;
  phoneNumber?: number;
  assignedUser?: number | string;
  approveStatus?: number;
  assignStatus?: number;
  fromDate: string;
  toDate: string;
  searchText?: string;
}
export const IdDocument = {
  '1': 'CCCD',
  '2': 'CMND',
  '3': 'Hộ chiếu',
};
export const optionsIdDocument = [
  {
    label: 'CCCD',
    value: '1',
  },
  {
    label: 'CMND',
    value: '2',
  },
  {
    label: 'Hộ chiếu',
    value: '3',
  },
];
export const optionsActiveChannel = [
  {
    label: 'App',
    value: '01',
  },
  {
    label: 'Web',
    value: '02',
  },
] 
export enum CENSORSHIPSTT {
  Pending = 1,
  Approved = 2,
  Recheck = 3,
  UpdateRequired = 4,
}

export const CensorshipStatus = {
  [CENSORSHIPSTT.Pending]: 'Chờ duyệt',
  [CENSORSHIPSTT.Approved]: 'Đã duyệt',
  [CENSORSHIPSTT.Recheck]: 'Kiểm duyệt lại',
  [CENSORSHIPSTT.UpdateRequired]: 'Yêu cầu cập nhật giấy tờ',
};
export const optionsApproveStatus = [
  {
    label: 'Chờ duyệt',
    value: CENSORSHIPSTT.Pending,
  },
  {
    label: 'Đã duyệt',
    value: CENSORSHIPSTT.Approved,
  },
  {
    label: 'Kiểm duyệt lại',
    value: CENSORSHIPSTT.Recheck,
  },
  {
    label: 'Yêu cầu cập nhật giấy tờ',
    value: CENSORSHIPSTT.UpdateRequired,
  },
]
export const CensorshipStatusColor = {
  [CENSORSHIPSTT.Pending]: ColorList.WAITING,
  [CENSORSHIPSTT.Approved]: ColorList.SUCCESS,
  [CENSORSHIPSTT.Recheck]: ColorList.PROCESSING,
  [CENSORSHIPSTT.UpdateRequired]: ColorList.FAIL,
};

export const BinaryStatusColor = {
  0: ColorList.WAITING,
  1: ColorList.SUCCESS,
};

export const AuditStatus = {
  0: 'Chưa hậu kiểm',
  1: 'Đã hậu kiểm',
  2: 'Kiểm duyệt lại',
};
export const optionsAuditStatus = [
  {
    label: 'Chưa hậu kiểm',
    value: 0,
  },
  {
    label: 'Đã hậu kiểm',
    value: 1,
  },
  {
    label: 'Kiểm duyệt lại',
    value: 2,
  },
]
export const AuditStatusColor = {
  0: ColorList.WAITING,
  1: ColorList.SUCCESS,
  2: ColorList.PROCESSING,
};

export const CustomerTypeEnum = {
  VIE: 'Cá nhân',
  VNS: 'Cá nhân',
  DN: 'Doanh nghiệp',
};
export interface IAssignPayload {
  assignUserName: string;
  assignUserId: string;
  ids: Key[];
}
export interface IApprovalStatus {
  id: number;
  code: string;
  value: string;
}
interface SubDocumentImageResponse {
  imageType: string;
  imageCode: string | null;
  imagePath: string;
  createdDate: string;
}
interface ErrorDetail {
  field: string;
  detail: string;
}
export interface ISubDocument {
  contractNo: string;
  customerCode: string;
  phoneNumber: string;
  serialSim: string;
  subDocumentImageResponses: SubDocumentImageResponse[];
  uploadDocumentDate: string;
  document: string;
  name: string;
  id: string;
  issue_by: string;
  issue_date: string | null;
  birthday: string | null;
  sex: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  expiry: string;
  nationality: string;
  otpStatus: number | string;
  videoCallStatus: number | string;
  videoCallUser: string;
  approveStatus: string;
  assignUserName: string;
  approveNumber: number | string;
  approveRejectReasonCode: string | null;
  approveNote: string | null;
  approveDate: string | null;
  auditStatus: string;
  auditRejectReasonCode: string | null;
  listErrorCode8Condition: ErrorDetail[];
  idExpireDateNote?: string | null;
  subDocumentId: string;
  packagePlan: string;
  actionAllow: number;
  createdContractDate: string;
  listUpdateApproveDoc: ISubDocument[];
  contractUploadType?: number;
  isdn: string;
}
export interface IOption {
  label: string;
  value: string;
}

export enum IDType {
  CCCD = '1',
  CMND = '2',
}

export enum TypeContractUpload {
  "ONLINE" = 1,
  "OFFLINE" = 2
}
export const optionsCustomerType = [
  {
    label: 'Cá nhân',
    value: 'VNS',
  },
  {
    label: 'Doanh nghiệp',
    value: 'DN',
  },
]


export interface IPayloadConfirm {
  name: string
  birthDate: string
  sex: string
  address: string
  province: string
  district: string
  precinct: string
  idNo: string
  idType: string
  idIssueDate: string
  idIssuePlace: string
  idIssueDateExpire: string
  contractNo: string
  contractUploadType: number
  customerCode: string
  providerAreaCode: string
  nationality: string
  uploadContractTime: string
  contractResignTime: string
  empId: string
  empName: string
  id: string;
  idExpireDate: string;
}
