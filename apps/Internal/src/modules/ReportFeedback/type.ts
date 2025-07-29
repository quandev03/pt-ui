import { IParamsRequest } from '@react/commons/types';

export enum PriorityEnum {
  URGENT = 'URGENT',
  NORMAL = 'NORMAL',
}
export interface IParamsDetailFeedbackReport extends IParamsRequest {
  fromDate?: string;
  toDate?: string;
  feedbackTypeId?: string;
  status?: string;
  priorityLevel?: string;
  createdBy?: string;
}
export interface IParamsFeedbackCreator extends IParamsRequest {
  userName?: string;
}

export interface IParamsFeedbacChannelsReport extends IParamsRequest {
  fromDate?: string;
  toDate?: string;
  timeType?: string;
  channels?: string;
}

export interface IParamsFeedbackTypeReport extends IParamsRequest {
  fromDate?: string;
  toDate?: string;
  timeType?: string;
  feedbackTypeIds?: string;
}
