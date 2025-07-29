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
  groups: any[];
  roles: IRoleItem[];
  client: IClient;
  organizationIds: number[];
  roleIds: string[];
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
  unit?: string[];
  email: string;
  groupIds?: string[];
  organizationIds?: string[];
}

export interface ICreateUpdateUserData {
  clientIdentity: string;
  id?: string;
  user: IFormUser;
}

export interface IDeleteUserData {
  clientIdentity: string;
  id: string;
}

export interface IUserDetailData {
  clientIdentity: string;
  id: string;
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
  position?: string[];
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

export interface IOrganizationPartner {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: any;
  orgCode: string;
  orgName: string;
  orgType: string;
  orgSubType: string;
  orgDescription: any;
  provinceCode: any;
  districtCode: any;
  wardCode: any;
  address: any;
  status: number;
  taxCode: string;
  contractNo: any;
  contractDate: string;
  representative: any;
  phone: string;
  email: string;
  orgPartnerType: string;
  orgBankAccountNo: any;
  contractNoFileUrl: any;
  businessLicenseFileUrl: any;
  businessLicenseNo: any;
  businessLicenseAddress: any;
  deliveryInfos: any[];
  contractNoFileLink: any;
  businessLicenseFileLink: any;
  approvalStatus: number;
  clientId: string;
}
