import { IParamsRequest } from '@react/commons/types';

export interface IEnterpriseHistoryItem {
  id: string;
  username: string;
  fullname: string;
  actionTime: string;
}
export interface IEnterpriseHistoryParam extends IParamsRequest {
  username: string;
  startTime: string;
  endTime: string;
  actionType: string;
  targetType: string;
}
