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
    code: string;
    value: string;
  }
  
  export interface IProfileParams {
    page: number;
    size: number;
    'value-search'?: string;
  }