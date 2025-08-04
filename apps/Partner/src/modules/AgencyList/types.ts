import { IParamsRequest } from '@vissoft-react/common';

export interface IAgency {
  parentId: string | number;
  id: string | number;
  agentName: string;
  agentCode: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  status: string | number;
}
export interface IAgencyParams extends IParamsRequest {
  status?: string;
  partner?: string;
}
export interface IFormAgency {
  id?: string;
  agencyCode: string;
  parentId: string;
  status: number;
}
