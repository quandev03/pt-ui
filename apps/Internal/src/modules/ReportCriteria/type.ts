import { IParamsRequest } from '@react/commons/types';
import { Dayjs } from 'dayjs';

export interface IParamsReportCriteria extends IParamsRequest {
  activeChannel?: string;
  activeDate?: string;
  failConditions?: string;
  orgName?: string;
  activeUser?: string;
  approveUser?: string;
  from?: string;
  to?: string;
  rangePicker?: [Dayjs, Dayjs];
}
