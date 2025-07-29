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
  stt: number;
  promotionName: string;
  startProcessDate: string;
  status: number;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  promotionId: string;
  filePath: string;
  resultFilePath: string;
}

export interface ReasonTypeItem {
  id: string;
  reasonTypeCode: string;
  reasonTypeName: string;
}

export interface IPromoParams {
  page: number;
  size: number;
  type: string;
  status: number;
  valueSearch: string;
  fromDate: string;
  toDate: string;
  param: string;
}

export interface IReasonTypeRequestParams {
  type: string;
}

export enum StatusTypeEnum {
  NOT_RUN = 0,
  RUNNING = 1,
  RAN = 2,
  PAUSED = 3,
  CANCELLED = 4,
  PAUSED2 = 6,
  CANCELLED2 = 7,
  CANCELLED3 = 8,
}

export const StatusType = {
  [StatusTypeEnum.NOT_RUN]: 'Chưa chạy',
  [StatusTypeEnum.RUNNING]: 'Đang chạy',
  [StatusTypeEnum.RAN]: 'Đã chạy',
  [StatusTypeEnum.PAUSED]: 'Tạm dừng',
  [StatusTypeEnum.CANCELLED]: 'Đã hủy',
  [StatusTypeEnum.PAUSED2]: 'Tạm dừng',
  [StatusTypeEnum.CANCELLED2]: 'Đã hủy',
  [StatusTypeEnum.CANCELLED3]: 'Đã hủy',
};
