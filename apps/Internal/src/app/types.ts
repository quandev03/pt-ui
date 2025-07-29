export interface INumberTransactionLine {
  id: number;
  transDate: string;
  isdnTransId: number;
  fromIsdn: number;
  toIsdn?: number;
  quantity: number;
  status: number;
  error: string;
  description: string;
  groupCode: string;
  groupName: string;
  isdnPattern: string;
  generalFormat: string;
  result: string;
}

export interface IAttachmentInfo {
  id: string | number;
  recordId: string | number;
  objectName: string;
  fileName: string;
  fileUrl: string;
  fileVolume: string | number;
  description: string;
  createdDate: any;
  createdBy: string;
  name: string;
  fileNumber: number;
  desc: string;
  size: string;
}

export interface IFileInfo {
  fileName: string;
  fileUrl: string;
}

export interface INumberTransactionDetail {
  id: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  transDate: string;
  stockId: number;
  stockName: string;
  ieStockId: number;
  ieStockName: string;
  transStatus: number;
  transStatusName: string;
  transType: number;
  transTypeName: string;
  approvalStatus: number;
  approvalStatusName: string;
  reasonId: number;
  processType: number;
  processTypeName: string;
  totalNumber: number;
  failedNumber: number;
  succeededNumber: number;
  description: string;
  uploadStatus: number;
  uploadStatusName: string;
  validSucceededNumber: number;
  validFailedNumber: number;
  moveType: number;
  moveTypeName: string;
  lines?: INumberTransactionLine[];
  uploadFile?: IFileInfo;
  resultCheckFile?: IFileInfo;
  resultFile?: IFileInfo;
  attachments?: IAttachmentInfo[];
  uploadFilename: string;
  productId?: number;
  isdn?: string;
  stepStatus?: number;
  productName: string;
  metadata: {
    checkProgress: number;
  };
}

export interface INumberStock {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: number | null;
  stockCode: string;
  stockName: string;
  stockType: number;
  status: number;
  description: string | null;
}
