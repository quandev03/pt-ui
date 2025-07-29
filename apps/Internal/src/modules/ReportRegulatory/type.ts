import { IParamsRequest } from '@react/commons/types';
import { Dayjs } from 'dayjs';

export interface IParamsReportRegulatory extends IParamsRequest {
  activeDate?: string;
  custType?: string;
  idType: string;
  fromDate?: string;
  toDate?: string;
  rangePicker?: [Dayjs, Dayjs];
  active_status?: string;
}
