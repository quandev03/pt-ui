import { ColorList, IParamsRequest } from '@vissoft-react/common';

export interface IParamsRequestUploadDigitalResources extends IParamsRequest {
  from: string;
  to: string;
  date?: string;
  createdDate?: string;
}

export enum NumberUploadStatus {
  PROCESSING = 1,
  FAILURE = 2,
  SUCCESS = 3,
}

export const mappingColorUploadStatus: {
  [key: number]: (typeof ColorList)[keyof typeof ColorList];
} = {
  [NumberUploadStatus.PROCESSING]: ColorList.WAITING,
  [NumberUploadStatus.SUCCESS]: ColorList.SUCCESS,
  [NumberUploadStatus.FAILURE]: ColorList.FAIL,
};

export interface IFormUploadNumber {
  description: string;
  numberFile: File;
}
export type IResponseUploadNumber = {
  approvalStatus: number;
  approvalStatusName: string;
  clientId: string;
  createdBy: string;
  createdDate: string;
  description: string;
  failedNumber: number;
  id: string;
  lines: null;
  metadata: null;
  modifiedBy: string;
  modifiedDate: string;
  orderId: null;
  orderNo: null;
  processType: number;
  processTypeName: null;
  quantity: null;
  reasonCode: null;
  reasonId: null;
  reasonName: null;
  reasonStatus: null;
  resultCheckFile: {
    fileName: string;
    fileUrl: string;
  };
  resultFile: {
    fileName: string;
    fileUrl: string;
  };
  status: null;
  stepStatus: number;
  succeededNumber: number;
  totalNumber: number;
  transDate: string;
  transStatus: number;
  transStatusName: string;
  uploadFile: {
    fileName: string;
    fileUrl: string;
  };
  uploadFilename: string;
  uploadStatus: number;
  uploadStatusName: string;
  validFailedNumber: number;
  validSucceededNumber: number;
};
