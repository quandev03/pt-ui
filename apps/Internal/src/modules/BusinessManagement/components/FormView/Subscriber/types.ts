import { IParamsRequest, ModelStatus } from '@react/commons/types';
import { Dispatch, SetStateAction } from 'react';

export interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface SubscriberRequest extends IParamsRequest {
  tab?: string;
  enterpriseId?: string;
  textSearch?: string;
  subType?: number;
  activeStatus?: number;
  dateType?: number;
  fromDate?: string;
  toDate?: string;
}

export interface SubscriberByListRequest {
  enterpriseId: number;
  idList: number[];
  actionCode: string;
  reasonCode: string;
  otherReason?: string;
  message?: string;
}

export interface SubscriberByFileRequest {
  metaData: {
    enterpriseId: number;
    actionCode: string;
    reasonCode: string;
    otherReason?: string;
    message?: string;
  };
  file: File;
}

export interface CancelSubscriberByListRequest {
  enterpriseId: number;
  idList: number[];
  reasonCode: string;
  otherReason?: string;
  description?: string;
}

export type Subscriber = {
  activeDate: string;
  id: number;
  isdn: string;
  name: string;
  packageExpirationDate: string;
  packageName: string;
  status: ModelStatus;
  subType: string;
};

export enum SubscriberType {
  M2M = 'M2M',
  H2H = 'H2H',
}
