import { IParamsRequest } from '@react/commons/types';
import { Dayjs } from 'dayjs';

export interface IParamsReportCensorship extends IParamsRequest {
  activeChannel?: string;
  orgName?: string;
  activeUser?: string;
  approveUser?: string;
  approveStatus?: number;
  fromDate?: string;
  toDate?: string;
  rangePicker?: [Dayjs, Dayjs];
}
