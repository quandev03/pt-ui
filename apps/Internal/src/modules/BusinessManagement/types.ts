import { IParamsRequest } from '@react/commons/types';

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
