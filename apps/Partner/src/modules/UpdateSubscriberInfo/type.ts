export enum StepEnum {
  STEP1 = 0,
  STEP2 = 1,
  STEP3 = 2,
  STEP4 = 3,
  STEP5 = 4,
  STEP6 = 5,
}
export enum VerifyTypeEnum {
  FACE = 'FACE',
  PASSPRT = 'PASSPORT',
}
export interface IPayloadVerifyOCR {
  serial: string;
  passport: File;
}
export interface OcrData {
  dob: string;
  expiredDate: string;
  fullname: string;
  gender: string;
  idNumber: string;
  issuedPlace: string;
  mrz: string;
  nationality: string;
  nicNumber: string;
  placeOfBirth: string;
  issuedDate: string;
}

export interface OcrResponse {
  failedStep: number;
  isdn: number;
  message: string | null;
  ocrData: OcrData;
  serial: string;
  status: number;
  transactionId: string;
}
export interface IPayloadVerifyFaceCheck {
  transactionId: string;
  portrait: File;
}
