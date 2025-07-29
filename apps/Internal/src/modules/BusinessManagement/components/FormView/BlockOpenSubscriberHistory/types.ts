import { IParamsRequest } from '@react/commons/types';

export interface BlockOpenSubscriberHistoryRequest extends IParamsRequest {
  tab?: string;
  enterpriseId?: string;
  textSearch?: string;
  actionCode?: string;
  subType?: number;
  fromDate?: string;
  toDate?: string;
}

export type BlockOpenSubscriberHistory = {
  actionDate: string;
  actionStatus: number;
  actionUser: string;
  description: string;
  failReason: string;
  id: number;
  isdn: string;
  name: string;
  reasonName: string;
  reasonNote: string;
  subType: string;
};
