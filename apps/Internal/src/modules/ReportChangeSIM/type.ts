import { IParamsRequest } from '@react/commons/types';
import { Dayjs } from 'dayjs';

export interface IParamsReportChangeSim extends IParamsRequest {
  changeSimChannel?: string;
  requestSimType?: string;
  changeSimUser?: string;
  processStatus?: string;
  rejectReason?: number;
  fromDate?: string;
  toDate?: string;
  reasonType?: string;
  rangePicker?: [Dayjs, Dayjs];
}
