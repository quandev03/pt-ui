import { IParamsRequest } from '@vissoft-react/common';

export interface IPackageSaleItem {
  clientId: string;
  createdBy: string;
  createdDate: string;
  succeededNumber: number;
  failedNumber: number;
  fileName: string;
  fileUrl: string;
  id: number;
  isdn: string;
  resultFileUrl: string;
  status: number;
  type: number;
  totalNumber: number;
}
export interface IPackageSaleParams extends IParamsRequest {
  type?: string;
}
export interface ISinglePackageSalePayload {
  isdn: string;
  pckCode: string;
  pinCode: string;
}
export interface IBulkCheckPayload {
  attachment: File;
}

export interface IBulkSalePayload {
  attachment: File;
  pinCode: string;
}

export interface IResGenOtp {
  id: string;
  isdn: string;
  idEkyc: string;
  transactionId: string;
}
export interface IPayloadGenOtp {
  isdn: string;
  isPackage: string;
  pckCode?: string;
  typePayment: number;
}
export interface IResGenOtp {
  id: string;
  isdn: string;
  idEkyc: string;
  transactionId: string;
}
export interface IPayloadRegister {
  isdn: string;
  idPackage: string;
  type: number | string;
  pckCode: string;
  otpConfirmRequest: {
    otp: string;
    id: string;
    isdn: string;
    transactionId: string;
  };
  cycle: number | string;
  unit: string;
}

export interface IPackage {
  createdBy: string;
  createdDate: string;
  description: string;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  packagePrice: number;
  pckCode: string;
  pckName: string;
  status: number;
  urlImagePackage: string;
}

export interface DownloadFileReq {
  fileType: 'FILENAME' | 'TEMPLATE' | 'RESULT';
  id?: number;
  fileName: string;
  detailId?: number;
}

export interface IApiOption {
  code: string;
  value: string;
}

export interface ISelectOption {
  value: number | string;
  label: string;
}

export interface ISaleParamsResponse {
  BATCH_PACKAGE_SALE_TYPE: IApiOption[];
  ISDN_TRANSACTION_TRANS_STATUS: IApiOption[];
  ISDN_TRANSACTION_UPLOAD_STATUS: IApiOption[];
  PIN_CODES_VALID_PIN: IApiOption[];
  SUBSCRIBER_ACTIVE_SUB_STATUS: IApiOption[];
  SUBSCRIBER_SUBS_STATUS: IApiOption[];
  SUBSCRIBER_SUB_STATUS: IApiOption[];
}
