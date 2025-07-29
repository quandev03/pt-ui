import { ColorList } from '@react/constants/color';
import { INumberTransactionDetail } from 'apps/Internal/src/app/types';

export const ApprovalProcessKey = {
  ORGANIZATION_UNIT: 'ORGANIZATION_UNIT',
};

export enum NumberStockTypes {
  GENERAL = 1, // Kho so chung
  SPECIFIC = 2, // Kho so rieng
  SALE = 3, // Kho ban hang
  CANCEL_AWAITING = 4, // Kho cho huy
  CANCELED = 5, //Kho hoan huy
}

export const DefaultNumberTransactionDetail: INumberTransactionDetail = {
  approvalStatus: 0,
  approvalStatusName: '',
  createdBy: '',
  createdDate: '',
  description: '',
  failedNumber: 0,
  id: 0,
  ieStockId: 0,
  ieStockName: '',
  modifiedBy: '',
  modifiedDate: '',
  moveType: 0,
  moveTypeName: '',
  processType: 0,
  processTypeName: '',
  reasonId: 0,
  stockId: 0,
  stockName: '',
  succeededNumber: 0,
  totalNumber: 0,
  transDate: '',
  transStatus: 0,
  transStatusName: '',
  transType: 0,
  transTypeName: '',
  uploadStatus: 0,
  uploadStatusName: '',
  validFailedNumber: 0,
  validSucceededNumber: 0,
  uploadFilename: '',
};

export enum NumberProcessType {
  INDIVIDUAL = 1,
  BATCH = 2,
}

export enum NumberTransactionStatus {
  PRE_START = 1,
  PROCESSING = 2,
  COMPLETE = 3,
  CANCEL = 4,
}

export enum ApprovalStatus {
  WAITING_APPROVAL = 1,
  APPROVING = 2,
  APPROVED = 3,
  DECLINE = 4,
  CANCEL = 5,
}

export const OPTION_NUMBER_PROCESS_TYPE = [
  { value: NumberProcessType.INDIVIDUAL, label: 'Đơn lẻ' },
  { value: NumberProcessType.BATCH, label: 'Theo lô' },
];
export const mappingColorTransStatus: {
  [key: number]: (typeof ColorList)[keyof typeof ColorList];
} = {
  [NumberTransactionStatus.PRE_START]: ColorList.WAITING,
  [NumberTransactionStatus.PROCESSING]: ColorList.PROCESSING,
  [NumberTransactionStatus.COMPLETE]: ColorList.SUCCESS,
  [NumberTransactionStatus.CANCEL]: ColorList.FAIL,
};
export const mappingColorApprovalStatus: {
  [key: number]: (typeof ColorList)[keyof typeof ColorList];
} = {
  [ApprovalStatus.WAITING_APPROVAL]: ColorList.WAITING,
  [ApprovalStatus.APPROVING]: ColorList.PROCESSING,
  [ApprovalStatus.APPROVED]: ColorList.SUCCESS,
  [ApprovalStatus.DECLINE]: ColorList.FAIL,
  [ApprovalStatus.CANCEL]: ColorList.FAIL,
};
