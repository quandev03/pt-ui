export interface IEsimWarehouseList {
  isdn: number;
  serial: string;
  packCode: string;
  orderNo: string;
  orgCode: string;
  orgName: string;
  status: number;
  status900: number;
  activeStatus: number;
  modifiedDate: string;
  genQrBy: string;
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
