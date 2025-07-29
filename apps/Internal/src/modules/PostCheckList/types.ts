import { IParamsRequest, ModelStatus } from '@react/commons/types';

export interface IParamsPostCheckList extends IParamsRequest {
  auditStatus?: string;
  userApproved?: string;
  phoneNumber?: string;
  fromDate?: string;
  toDate?: string;
  typeDate?: string;
  criterions?: any;
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
  auditStatus: number; // 0: Chưa duyệt, 1: Đã duyệt, 2: Từ chối
  docUpdateStatus: string;
  assignStatus: string;
  assignUserName: string;
  preApprovalUserName: string;
  createdDate: string;
  modifiedDate: string;
}

export interface IDataPostCheckListDetail {
  id: number;
  actionAllow: number;
  customerCode: string;
  userName: string | null;
  sex: string;
  birthDate: string;
  contractNo: string;
  address: string;
  province: string;
  district: string;
  precinct: string;
  phoneNumber: string;
  serialNumber: string;
  imageResponseDTOList: IImageResponseDTO[];
  subDocumentHistoryDTOS: ISubDocumentHistoryDTO[];
  idType: string;
  idNo: string;
  idIssueDate: string;
  idIssuePlace: string;
  idIssueDateExpire: string;
  nationality: string;
  expireDateNote: string;
  otpStatus: number;
  videoCallStatus: number;
  videoCallUser: string;
  approvalNumber: number | null;
  auditStatus: number;
  approveNote: string | null;
  approveDate: string;
  createdDate: string;
  modifiedDate: string | null;
  approveStatus: number;
  uploadDate: string;
  violationCriteria: any[];
  auditRejectCode: string;
}
export interface IDataConfirmAuditSub {
  id: string;
  auditNote: string;
}
interface IImageResponseDTO {
  id: number;
  subDocumentId: number;
  imageType: string;
  imageCode: string;
  imagePath: string;
}

export interface ISubDocumentHistoryDTO {
  id: number;
  subDocumentId: number;
  version: number;
  isLatestVersion: number;
  name: string;
  userName: string | null;
  birthDate: string;
  sex: string;
  nationality: string;
  address: string;
  province: string;
  district: string;
  precinct: string;
  idNo: string;
  idType: string;
  idIssueDate: string;
  idIssuePlace: string;
  idExpireDate: string;
  createdBy: string;
  createdDate: string;
}

export interface IDataReAppoval {
  ids: string[];
  assignedUserId: string;
  assignedUserName: string;
  reasonRejectCode: string;
  auditNote?: string;
}

export const getCustomerStatusString = (status: ModelStatus): string => {
  switch (status) {
    case ModelStatus.ACTIVE:
      return 'Đang hoạt động';
    case ModelStatus.INACTIVE:
      return 'Không hoạt động';
    default:
      return '';
  }
};

export enum ApprovalStatusValue {
  ChoDuyet = 1,
  DaDuyet = 2,
  KiemDuyetLai = 3,
  YeuCauCapNhatGiayTo = 4,
}
export enum AuditStatusValue {
  ChuaHauKiem = 0,
  DaHauKiem = 1,
  KiemDuyetLai = 2,
}