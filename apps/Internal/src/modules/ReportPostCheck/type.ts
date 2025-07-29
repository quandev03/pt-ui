import { IParamsRequest } from '@react/commons/types';
import { Dayjs } from 'dayjs';

export interface IParamsReportPostCheck extends IParamsRequest {
  activeChannel?: string;
  orgName?: string;
  userName?: string;
  fromDate?: string;
  toDate?: string;
  rangePicker?: [Dayjs, Dayjs];
}
