export const enum EDateType {
  CREATE = '1',
  UPDATE = '2',
}

export const enum EStatusPromotionRest {
  ACTIVE = 0,
  IN_ACTIVE = 1,
}

export interface PayloadAddPromotionRest {
  promotionCode: string;
  name: string;
  description: string;
  status: EStatusPromotionRest;
}

export interface UpdatePromotionProgramDto {
  id: number;
  promotionCode: string;
  name: string;
  description: string;
  status: EStatusPromotionRest;
}
export interface PayloadUpdatePromotionRest {
  promotionProgramDto: UpdatePromotionProgramDto;
}
export interface IPromotionRest {
  id: number;
  promotionCode: string;
  name: string;
  description?: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: EStatusPromotionRest;
}

export interface IParamsCheckExists {
  promotionCode: string;
  isSubmitForm?: boolean;
}

export enum EStatusExecutePromotion {
  NOT_STARTED = 0, // Chưa chạy
  RUNNING = 1, // Đang chạy
  COMPLETED = 2, // Đã chạy
  PAUSED = 3, // Tạm dừng
  CANCELED = 4, // Đã hủy
}

export interface IExecutePromotion {
  id: number
  promProgramId: string
  fileName: string
  filePath: string
  totalRecords: number
  successfulRecords: number
  failedRecords: number
  errorFilePath: any
  status: number
  processingStartDate: string
  processingEndDate: string
  createdBy: string
  createdDate: string
  modifiedBy: string
  modifiedDate: string
  note: string
}
