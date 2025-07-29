import { ColorList } from '@react/constants/color';

export interface ISubscriberImpactReportItem {
  id: number;
  actionCode: string;
  fileName: string | null;
  filePath: string | null;
  enterprise: string;
  contractNumber: string;
  empName: string;
  createdDate: string;
  status: number;
  successCount: number | null;
  failedCount: number | null;
  resultFilePath: string | null;
  description: string | null;
}
export interface IImpactReportParams {
  page: number;
  size: number;
  param?: string;
  actionCode?: string;
  fromDate: string;
  toDate: string;
  form?: number;
  status?: number;
}
export interface IActionItem {
  id: number;
  type: string;
  code: string;
  name: string;
  dataType: string | null;
  value: string | null;
  status: number;
  statusOnline: string | null;
}
export const StatusColor = {
  1: ColorList.PROCESSING,
  2: ColorList.SUCCESS,
};
export enum StatusEnum {
  PROCESSING = 1,
  SUCCESS = 2,
}
