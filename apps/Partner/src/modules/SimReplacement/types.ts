import { IParamsRequest } from '@react/commons/types';
import { ColorList } from '@react/constants/color';

export interface ISimReplacementItem {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  simType: string;
  stockCode: string;
  email: string;
  processStatus: string | number;
  processDate: string;
  fileUrl: string;
  fileAttachmentUrl: string;
  fileAttachmentName: string;
  description: string;
  fileResultUrl: string;
  totalNumber: number;
  failedNumber: number;
  succeededNumber: number;
  partnerCode: string;
  filename: string;
  partnerName: string | null;
}
export enum ProcessStatusEnum {
  PROCESSING = 1,
  COMPLETED = 2,
}

export enum SimTypeEnum {
  SIM = '1',
  ESIM = '2',
}
export interface ISimReplacementDetail {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  batch: string;
  isdn: string;
  simType: string;
  oldSerial: string;
  newSerial: string;
  oneBlockDate: string;
  twoBlockDate: string;
  closeDate: string;
  oneBlockExpectDate: string;
  twoBlockExpectDate: string;
  closeExpectDate: string;
  lastPckCode: string;
  pckExpiryDate: string;
  changeSimDate: string;
  stockCode: string;
  orgCode: string;
  fileUrl: string;
  shopCode: string;
}
export interface ISimReplacementParams extends IParamsRequest {
  fromDate: string;
  toDate: string;
  simType?: string;
}
export interface IOrgPartner {
  id: number;
  parentId: number | null;
  orgCode: string;
  orgName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: number;
  email: string;
}

export const ProcessStatus = {
  1: ColorList.PROCESSING,
  2: ColorList.SUCCESS,
};
