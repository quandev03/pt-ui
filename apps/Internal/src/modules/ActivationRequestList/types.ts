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
  
  export interface IImageItem {
    id: number;
    subActiveRequestId: number;
    imageType: number;
    imageCode: number;
    imagePath: string;
    imageLink: string;
  }
  export interface ContentItem {
    id: string;
    empName: string;
    distributor: string;
    contractNo: string;
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
    address: string; 
    custNo: string;
    district: string;
    empUser: string;
    idExpireDate: string;
    idIssueDate: string;
    idIssueExpireDate: string;
    idIssuePlace: string; 
    precinct: string;
    province: string;
    requestImageResponses: IImageItem[]
  }

  export interface IActiveRequestParams {
    page: number;
    size: number;
    number: number;
    status: number;
    type: number;
    fromDate: string;
    toDate: string;
  }
  
  export const ApproveStatus = {
    0: 'Chờ duyệt',
    1: 'Đã duyệt',
    2: 'Từ chối',
    3: 'Hủy yêu cầu kích hoạt'
  }

  export const ActiveStatus = {
    0: 'Chưa kích hoạt',
    1: 'Đã kích hoạt',
    2: 'Kích hoạt thất bại',
    3: 'Hủy yêu cầu kích hoạt'
  }

  export const idType = {
    1: 'CCCD',
    2: 'CMND',
    3: 'HC'
  }