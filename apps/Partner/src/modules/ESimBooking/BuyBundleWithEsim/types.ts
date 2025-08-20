export interface IPackagedEsimBooking {
  id: string;
  orgId: string;
  orderNo: string;
  amountTotal: number;
  status: number;
  reasonId: string;
  description: string;
  note: string;
  orderType: number;
  customerEmail: string;
  quantity: number;
  cancelReason: string;
  succeededNumber: number;
  failedNumber: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  finishedDate: string;
  bookEsimStatus: number;
  pckCode: string;
  orderDate: string;
}

export interface IBookPackagedEsim {
  id?: string;
  quantity: number;
  pckCode: string[];
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
