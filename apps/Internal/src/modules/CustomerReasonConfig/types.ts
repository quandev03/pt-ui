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
    stt: number;
    reasonId: number;
    reasonTypeCode: string;
    reasonTypeName: string;
    reasonCode: string;
    reasonName: string;
    status: number;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
  }
  
  export interface ReasonTypeItem {
    id: string;
    reasonTypeCode: string;
    reasonTypeName: string;
  }

  export interface IReasonParams {
    page: number;
    size: number;
    param: string;
    type: string;
  }

  export interface IReasonTypeRequestParams {
    type: string;
  }