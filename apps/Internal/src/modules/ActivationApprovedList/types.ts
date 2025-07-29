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
    approveStatus: number;
    approveStatusCheck: string;
    reasonReject: string;
  }

  export interface IActiveApproveParams {
    page: number;
    size: number;
    number: number;
    type: number;
    status: number;
    fromDate: string;
    toDate: string;
  }
