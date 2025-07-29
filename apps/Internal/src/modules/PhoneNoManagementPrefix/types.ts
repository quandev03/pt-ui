export interface UserItem {
    username: string;
    id: string;
    status: number;
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
  
  export interface GetListResponse<T> {
    data: T[];
  }
  
  export interface ContentItem {
    id: string;
    parentId: number;
    isdnPrefix: string;
    description: string;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
  }

  export interface IParamsRequest {
    page: number;
    size: number;
    prefix: string;
  }
  