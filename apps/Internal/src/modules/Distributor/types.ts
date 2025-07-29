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

export interface IOrganizationItem {
  id: number;
  orgName: string;
  orgCode: string;
  orgPartnerType: string | null;
  createdBy: string;
  createdDate: string;
  updatedBy: string | null;
  updatedDate: string | null;
  status: number;
  approvalStatus: number;
}
export interface IOrganizationPayload {
  id?: number;
  orgName: string;
  orgCode: string;
  orgPartnerType: string | null;
  status: number;
  approvalStatus: number;
}
