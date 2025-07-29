import { IParamsRequest } from '@react/commons/types';
import { RcFile } from 'antd/es/upload';

export interface IColumnExportNumberPartner {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  transDate: string;
  stockId: number;
  stockName: string;
  ieStockId: number;
  ieStockName: string;
  transStatus: number;
  transStatusName: string;
  transType: number;
  transTypeName: any;
  approvalStatus: any;
  approvalStatusName: any;
  reasonId: any;
  status: any;
  processType: number;
  processTypeName: string;
  logFileUrl: any;
  totalNumber: any;
  failedNumber: any;
  succeededNumber: any;
  description: string;
  uploadStatus: number;
  uploadStatusName: string;
  validSucceededNumber: any;
  validFailedNumber: any;
  moveType: any;
  moveTypeName: string;
  resultCheckFile: any;
  resultFile: any;
  productId: any;
  reasonCode: any;
  reasonName: any;
  reasonStatus: any;
  uploadFile: UploadFile;
  uploadFilename: string;
  lines: any;
  attachments: any[];
  stepStatus: number;
  orderId: number;
  orderNo: string;
  quantity: number;
  metadata: {
    checkProgress: number;
  };
}

export interface UploadFile {
  fileName: string;
  fileUrl: string;
}

export interface IExportNumberPartnerParams extends IParamsRequest {
  export?: string;
}

export interface PayloadCreate {
  stockId: number;
  orderId: number;
  description?: string;
  numberFile: RcFile;
}
