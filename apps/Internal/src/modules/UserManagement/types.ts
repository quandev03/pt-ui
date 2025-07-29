import { IParamsRequest } from '@react/commons/types';
import { IRoleItem } from '../RoleManagement/types';

export enum StatusUserEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ALL = 'ALL',
}

export interface IUserParams extends IParamsRequest {
  status?: StatusUserEnum;
  partner?: string;
}

export interface IUserItem {
  id: string;
  username: string;
  fullname: string;
  gender: number;
  email: string;
  idCardNo: any;
  phoneNumber: any;
  dateOfBirth: string;
  status: number;
  type: string;
  groups: IGroups[];
  roles: IRoleItem[];
  client: IClient;
  unit: IRelationUser[];
  departments: IDepartment[];
  loginMethod: number | string;
}

export interface IGroups {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  clientIdentity: string;
  id: string;
  code: string;
  name: string;
  status: number;
}

export interface IClient {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  code: string;
  name: string;
  contactName: string;
  contactEmail: any;
  contactPosition: any;
  contactPhone: string;
  permanentAddress: string;
  permanentProvinceId: number;
  permanentDistrictId: number;
  permanentWardId: number;
  status: number;
}

export interface IFormUser {
  id?: string;
  fullname: string;
  username: string;
  status: number;
  roleIds: string[];
  phoneNumber?: string;
  email: string;
  organizationIds?: string[];
  groupIds?: string[];
  position: string;
  departments: string[];
  departmentIds: string[] | string;
}

export interface IOrganization {
  id: number;
  parentId: number;
  orgCode: string;
  orgName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: number;
}

export interface IRelationUser {
  id: number;
  userId: string;
  orgId: number;
}

export interface IAllGroupUser {
  id: string;
  code: string;
  name: string;
  status: number;
}

export interface IDepartment {
  id: number;
  name: string;
  status: number;
  code?: string
}
