import { IParamsRequest } from '@react/commons/types';

export type IRoleParams = IParamsRequest & {
  isPartner: boolean;
};

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
  isPartner?: boolean;
}

//

export interface ObjectActionsItem {
  objectId: string;
  actionId: string;
}

export interface IObjectItem {
  id: string;
  key: string;
  name: string;
  status: number;
  description?: string;
  objectActions?: ObjectActionsItem[];
  checkedKeys?: string[];
  isPartner?: boolean;
}

export interface IFullMenu {
  key: string;
  title: string;
  children: IChildren[];
}

export interface IChildren {
  key: string;
  title: string;
  children: IChildren[];
}

export type PropsRole = {
  isPartner: boolean;
};
