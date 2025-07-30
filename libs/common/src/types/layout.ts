import { ItemType } from 'antd/es/menu/interface';
import { AnyElement, IOption, MenuObjectItem, RouterItems } from './types';
import { RouteObject } from 'react-router-dom';

export interface IUserInfo extends Record<string, unknown> {
  username?: string;
  gender?: string;
  dateOfBirth?: string;
  idCardNo?: string;
  code?: string;
  fullname?: string;
  phoneNumber?: string;
  type?: string;
  organization?: string;
  position?: string;
  needChangePassword?: boolean;
  createdDate?: string;
  id: string;
  groups: AnyElement[];
  roles: AnyElement[];
  groupOptions?: AnyElement[];
  roleOptions?: AnyElement[];
  departments: AnyElement[];
}

export type IParamsOption<T extends string = string> = Record<T, IOption[]>;

export type PayloadType = {
  newPwd: string;
  oldPwd: string;
  username: string;
};

export interface ILayoutService {
  mappingMenus: (
    menuData: MenuObjectItem[],
    pathname: string
  ) => {
    key: string;
    icon: React.ReactNode;
    children: ItemType[] | null;
    label: JSX.Element;
  }[];
  convertMenuItemToItem: (
    { parentId, label, key, icon, hasChild }: RouterItems,
    menus: RouterItems[],
    pathname: string,
    isChildMenu?: boolean
  ) => {
    key: string;
    icon: React.ReactNode;
    children: ItemType[] | null;
    label: JSX.Element;
  } | null;

  fetcherChangePassword: (payload: PayloadType) => Promise<unknown>;
  logout: (refreshToken: string) => Promise<unknown>;
}

export type IStringNumber = string | number;

export type IPathRoutes = RouteObject['path'];

// Authentication Types
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}
// Error Types
export interface ApiError {
  status: number;
  message: string;
  errors?: FieldError[];
  timestamp?: string;
  path?: string;
}
export interface FieldError {
  field: string;
  message: string;
  code?: string;
}
