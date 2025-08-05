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
}
