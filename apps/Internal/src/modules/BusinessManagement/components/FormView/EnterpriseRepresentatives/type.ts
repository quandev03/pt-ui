import { IParamsRequest } from '@react/commons/types';
import { ColorList } from '@react/constants/color';

export interface IRepresentativeItem {
  id: number;
  name: string;
  idType: number;
  idNo: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: number;
}

export interface IParamsRepresentative extends IParamsRequest {
  tab?: string;
  param?: string;
  dateType?: string;
  from?: string;
  to?: string;
  enterpriseId: string;
}

export const StatusColor = {
  0: ColorList.DEFAULT,
  1: ColorList.SUCCESS,
};
export interface IOcrResponse {
  documentType: string;
  name: string;
  id: string;
  issueBy: string;
  issueDate: string;
  birthday: string;
  sex: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  expiry: string;
  idEkyc: string;
  nationality: string;
  providerAreaCode: string;
  errors: string | null;
  c06_errors: string | null;
  c06SuccessMessage: string | null;
}
export interface IRepDetailItem {
  id: number;
  startDate: string;
  endDate: string;
  idType: string;
  name: string;
  idNo: string;
  idIssuePlace: string;
  idIssueDate: string;
  birthday: string;
  sex: string;
  address: string;
  province: string;
  district: string;
  precinct: string;
  idExpiry: string;
  idFrontPath: string;
  idBackPath: string;
  portraitPath: string;
  authorizedFilePath: string;
  status: number;
  authorizedFileName: string;
}
export interface IConfigItem {
  id: number;
  type: string;
  code: string;
  name: string;
  dataType: string | null;
  value: string;
  status: number;
  statusOnline: number;
}

export enum IDType {
  CCCD = '1',
  CMND = '2',
}
