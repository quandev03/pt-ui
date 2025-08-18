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
  resultFileUrl: string;
  status: number;
  totalNumber: number;
}
export interface IPackageSaleParams extends IParamsRequest {
  type?: string;
}
export interface ISinglePackageSalePayload {
  isdn: string;
  package: string[];
}
export interface IBulkPackageSalePayload {
  attachment: File;
}
// export interface IPackage {
//   packageId: string;
//   packageCode: string;
//   cycle: number;
//   unit: string;
// }
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
export interface IPayloadConfirmOtp {
  otp?: string;
  id: string;
  isdn: string;
  transactionId: string;
  cycle?: number | string;
  unit?: string;
  type: string | number;
  pckCode?: string;
  idPackage: string;
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
