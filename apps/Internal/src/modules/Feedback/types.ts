export enum PageFilterEnum {
  BO = 'BO',
  CSKH = 'CSKH',
  ASSIGNED = 'ASSIGNED',
}

export enum PriorityEnum {
  URGENT = 'URGENT',
  NORMAL = 'NORMAL',
}

export enum StatusEnum {
  APPROVING = '1',
  CANCELED = '2',
  REJECTED = '9',
  NOT_APPROVED = '3',
  PENDING = '6',
  PROCESSING = '4',
  PROCESSED = '7',
  CLOSED = '5',
  REPROCESS = '8',
}

export enum ReasonEnum {
  DUPLICATED = 'DUPLICATED',
  DONE = 'DONE', // Phản ánh đã được xử lý
  WRONG = 'WRONG', //Phản ánh nhập thiếu/sai
  OTHER = 'OTHER', // Khác
}

export interface IFeedbackType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: number;
  typeName: string;
  typeCode: string;
  status: number;
  feedbackSlaConfigs: FeedbackSlaConfig[];
  level: number;
}

export interface FeedbackSlaConfig {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  priorityLevel: string;
  approvalDeadline: number;
  processingDeadline: number;
  closingDeadline: number;
  completionDeadline: number;
}
export interface IFeedback {
  id: number;
  feedbackTypeId: number; // loại phản ánh
  isdn: string; // số thuê bao phản ánh
  contactNumber: string; // số thuê bao liên hệ
  requester: string; // tên người phản ánh
  content: string; // nội dung phản ánh
  approvalDepartment: string; // BO duyệt
  closeApprovalDepartment: string;
  priorityLevel: string; // độ ưu tiên
  status: StatusEnum; // trạng thái
  processor: string;
  deadline: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  departmentCode: string; // mã phòng ban
  processorDepartment: string;
  warning: boolean;
}

export interface IFeedbackParam {
  feedbackTypeId?: number;
  isdn?: string;
  priorityLevel?: string;
  status?: number;
  feedbackDateExpire?: string;
  departmentCode?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}
export interface IFeedbackRequest {
  dto: FeedbackDto;
  files: any[];
  attachmentDescriptions: string[];
}

export interface FeedbackDto {
  feedbackTypeId: number;
  isdn: string;
  contactNumber: string;
  approvalDepartment: string;
  priorityLevel: string;
  feedbackHours: number;
  content: string;
  feedbackNote: string;
  departmentCode: string;
}

export enum FeedbackChannelEnum {
  Call = 'Call',
  Live = 'Chat Live',
  Comment = 'Comment Facebook',
  InboxFacebook = 'Inbox Facebook',
  InboxZalo = 'Inbox Zalo',
  VideoCall = 'Video Call',
  Email = 'Email',
  Store = 'Cửa hàng',
  Other = 'Khác',
}

export interface NoteFeedbackRequest {
  feedbackRequestId: number | string;
  noteContent: string;
}

export interface IChangeStatusFeedback {
  feedbackIds: number[] | string[];
  departmentCode?: string[] | null;
  departmentName?: string[] | null;
  reasonCode?: string;
  reasonDetail?: string;
  note?: string;
  processor?: string;
  message?: string;
  isBO?: boolean;
}

export type ModalTypeReason = 'close' | 'open' | 'cancel' | 'reject' | null;

export enum FeedbackDestinationEnum {
  APPROVE = 'APPROVE_TIME',
  HANDLE = 'HANDLE_TIME',
  CLOSE = 'CLOSE_TIME',
}
export type IListChannelFeedback = {
    activeChannel: string
    channels: string[]
    code: string
    dataType: string
    id: number
    name: string
    status: number
    statusOnline: string
    type: string
    value: string
};