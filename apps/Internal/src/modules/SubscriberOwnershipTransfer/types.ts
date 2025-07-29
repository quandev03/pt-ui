import { RcFile } from 'antd/es/upload';

export interface ChildRef {
  clearImage: () => void;
}

export interface FormSubscriberOwnershipTransfer {
  //  CustomerInfo
  isdn: number;
  name: string;
  idNo: string;
  issueBy: string;
  issueDate: string;
  birthday: string;
  sex: number;
  address: string;
  city: number;
  district: number;
  ward: number;
  expiry: string;
  appObject: string;
  documentType: string;
  idEkyc: string;
  idCardFrontSite: RcFile;
  idCardBackSite: RcFile;
  portrait: RcFile;
  otp: string;
}

export enum DocumentTypeEnum {
  CCCD = '1',
  CMND = '2',
}
