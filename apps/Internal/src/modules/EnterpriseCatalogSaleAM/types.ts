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
    reasonId: string;
    id: string;
    userId: string;
    username: string;
    fullname: string;
    phoneNumber: string;
    email: string;
    parentId: string;
    children: ContentItem[];
  }

  export interface ICatalogSaleAMRequest {
    page: number;
    size: number;
    param: string;
    positionCode : string;
  }

  export interface IUserRequestParams {
    page: number;
    size: number;
    param: string;
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