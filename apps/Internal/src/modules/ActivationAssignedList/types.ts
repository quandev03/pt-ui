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
    empName: string;
    distributor: string;
    contractNo: string;
    requestDate: string;
    isdn: string;
    name: string;
    birthDate: string;
    idNo: string;
    idType: string;
    custType: string;
    activeStatus: string;
    status: string;
    rejectedReason: string;
    approveUser: string;
    approveDate: string;
    approveStatus: string;
    approveStatusCheck: string;
    reasonReject: string;
  }

  export interface IActiveAssignParams {
    page: number;
    size: number;
    number: number;
    status: number;
    "type-date": number;
    "type-approve": number;
    fromDate: string;
    toDate: string;
  }