import { IParamsRequest } from '@react/commons/types';
import { Dayjs } from 'dayjs';

export interface IParamsReportActivate extends IParamsRequest {
  activeDate?: string;
  activeChannel?: string;
  orgName?: string;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  rangePicker?: [Dayjs, Dayjs];
}
