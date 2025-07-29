import { IParamsRequest } from '@react/commons/types';

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
  idCardNo: any;
  phoneNumber: any;
  dateOfBirth: string;
  status: number;
  type: string;
  groups: any[];
  roles: any[];
  client: IClient;
  organizationIds: number[];
  roleIds?: string[];
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
  organizationIds?: string[];
  clientId: string;
  email?: string;
}

export interface ICreateUpdateUser {
  code: string;
  username: string;
  password: string;
  fullname: string;
  idCardNo: string;
  dateOfBirth?: string;
  address: string;
  email: string;
  phoneNumber?: string;
  gender: number;
  organization: string;
  position?: [string];
  status: number;
  type: string;
  groupIds: string[];
  roleIds: string[];
  id?: string;
}

export interface GroupItem {
  id: string;
  key: string;
  title: string;
  name: string;
  status: 0 | 1;
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

export interface IRoleItem {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  name: string;
  code: string;
  status: number | boolean;
  description: string;
  checkedKeys: string[];
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
