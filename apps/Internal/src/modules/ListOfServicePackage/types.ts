import { StatusEnum, TypeTagEnum } from '@vissoft-react/common';

export interface IListOfServicePackage {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: string;
  pckCode: string;
  pckName: string;
  packagePrice: number;
  status: number;
  description: string;
}
export interface IListOfServicePackageForm {
  pckCode: string;
  pckName: string;
  packagePrice: number;
  status: boolean | StatusEnum;
  images: File | null;
  description?: string;
}

// Transaction status: 0: Chờ thực hiện, 1: Đang thực hiện, 2: Hoàn thành
export enum TransactionStatusCode {
  PENDING = '0',
  IN_PROGRESS = '1',
  COMPLETED = '2',
}

export const TransactionStatusTagMap: Record<
  TransactionStatusCode,
  TypeTagEnum
> = {
  [TransactionStatusCode.PENDING]: TypeTagEnum.WARNING,
  [TransactionStatusCode.IN_PROGRESS]: TypeTagEnum.PROCESSING,
  [TransactionStatusCode.COMPLETED]: TypeTagEnum.SUCCESS,
};

// Upload status: 1: Đang kiểm tra, 2: Thất bại, 3: Thành công
export enum UploadStatus {
  CHECKING = '1',
  FAILED = '2',
  SUCCESS = '3',
}

export const UploadStatusTagMap: Record<UploadStatus, TypeTagEnum> = {
  [UploadStatus.CHECKING]: TypeTagEnum.PROCESSING,
  [UploadStatus.FAILED]: TypeTagEnum.ERROR,
  [UploadStatus.SUCCESS]: TypeTagEnum.SUCCESS,
};
