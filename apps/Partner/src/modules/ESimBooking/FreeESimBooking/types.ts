export interface IFreeEsimBooking {
  id: string;
  quantity: number;
  pckCode: string;
  createdBy: string;
  createdDate: string;
  finishedDate: string;
  status: number;
  succeededNumber: string;
  failedNumber: string;
}

export interface IBookFreeEsim {
  id?: string;
  quantity: number;
  pckCode: string[];
  description: string;
}

export type IBookFreeEsimPayload = IBookFreeEsim[];

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
