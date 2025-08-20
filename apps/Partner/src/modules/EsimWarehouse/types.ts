export interface IEsimWarehouseList {
  activeStatus: number;
  genQrBy: string;
  isdn: number;
  modifiedDate: string;
  orderNo: string;
  orgCode: string;
  orgName: string;
  packCode: string;
  serial: string;
  status: number;
  status900: number;
  statusSub: number;
  subId: string;
}

export interface IEsimWarehouseDetails {
  id: string;
  subId: string;
  actionDate: string;
  actionCode: string;
  description: string;
  shopCode: string;
  empCode: string;
  empName: string;
  reasonCode: string;
  reasonNote: string;
  createdDate: string;
  createdBy: string;
}

export interface IQrCodeSent {
  subId: string;
  email: string;
}

export interface IQrCodeGen {
  subId: string;
  size: string;
}

export type IGetPackageCodes = IGetPackageCodesItems[];

export interface IGetPackageCodesItems {
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
  urlImagePackage: string;
}

export interface ICustomerInfo {
  nationality: string;
  typeDocument: string;
  contractCode: string;
  gender: number;
  customerCode: string;
  fullName: string;
  birthOfDate: string;
  idNoExpireDate: string;
  issuePlace: string;
  idNumber: string;
}
