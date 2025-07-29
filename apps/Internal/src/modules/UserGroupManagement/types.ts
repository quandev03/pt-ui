import { IParamsRequest } from '@react/commons/types';

export interface UserItem {
  username: string;
  id: string;
  status: number;
}

export type IGroupUserParams = IParamsRequest;

export interface IUserGroup {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  code: string;
  name: string;
  status: number;
  roles: Role[];
  users: User[];
  roleIds: string[];
  userIds: string[];
}

export interface PayloadCreateUpdateGroup {
  code: string;
  name: string;
  roleIds: string[];
  userIds: string[];
  id?: string;
  status?: number;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  status: 0 | 1;
}

export interface User {
  id: string;
  username: string;
  status: 0 | 1;
  needChangePassword: boolean;
  attributes: Attributes;
  name: string;
}

export interface Attributes {
  name: string;
}
