export interface UserItem {
  username: string;
  id: string;
  status: number;
}

export interface ContentItem {
  id: string;
  name: string;
  status: number;
  code: string;
  roles: RoleItem[];
  users: UserItem[];
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  roleIds: string[];
  userIds: string[];
}

export interface RoleItem {
  id: string;
  code: string;
  name: string;
  status?: number;
}

export interface PayloadCreateUpdateGroup {
  code: string;
  name: string;
  roleIds: string[];
  userIds: string[];
  id?: string;
  status?: number;
}

export interface ISupplierParams {
  page: number;
  size: number;
  'search-string'?: string;
  status?: 1 | 0 | '';
}

export interface ISupplierItem {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  supplierCode: string;
  supplierName: string;
  status: number;
}
export interface PayloadSupplier {
  id?: number;
  supplierCode: string;
  supplierName: string;
  status: number;
}
