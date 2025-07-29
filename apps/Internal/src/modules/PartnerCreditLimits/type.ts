import { FileData } from '@react/commons/TableUploadFile';
import { IParamsRequest } from '@react/commons/types';

export interface IPartnerCreditLimitsParams extends IParamsRequest {
  'value-search'?: string;
}

export interface IPartnerLimitsHistoryParams extends IParamsRequest {
  'start-date'?: string;
  'end-date'?: string;
  id?: string;
}

export interface IPartnerCreditLimitsList {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  limitAmount: number;
  description: string;
  orgId: number;
  debtTotalAmount: number;
  orgName: string;
  orgPartnerType: any;
  attachments: IAttachment[];
}

export interface IAttachment {
  id: number;
  recordId: number;
  objectName: string;
  fileName: string;
  fileUrl: string;
  fileVolume: number;
  description: string;
  createdDate: string;
  createdBy: string;
}

export interface IPayloadCreatePartnerCreditLimits {
  dto: Dto;
  files: string[];
  attachmentDescriptions: string[];
}

export interface Dto {
  id?: number;
  limitAmount: number;
  description?: string;
  orgId: number;
  debtTotalAmount?: number;
  orgName?: string;
  orgPartnerType?: string;
  attachments?: IAttachment[];
}

export type IPayloadCreateForm = Pick<
  Dto,
  'orgId' | 'limitAmount' | 'description'
> & {
  files: FileData[];
};

export interface IDto {
  id: number;
  orgId: number;
  debtAmount: number;
  debtType: number;
  reasonId: number;
  reasonName: string;
  description: string;
  createdBy: string;
  createdDate: string;
  attachments: IAttachment[];
  adjustmentDate: string;
}

export interface IPayloadCreateDebtAdjustment {
  dto: IDto;
  files: string[];
  attachmentDescriptions: string[];
}

export type IPayloadCreateFormDebtAdjustment = Pick<
  IDto,
  | 'orgId'
  | 'debtAmount'
  | 'debtType'
  | 'reasonId'
  | 'description'
  | 'adjustmentDate'
> & { files: FileData[] };
export interface IPartnerWithoutLimit {
  id: number;
  parentId: any;
  orgCode: string;
  orgName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: number;
}
