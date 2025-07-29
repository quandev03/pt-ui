import { ColorList } from '@react/constants/color';

export interface IPackage {
  packageId: string;
  packageCode: string;
  cycle: number;
  unit: string;
}
export interface IPayloadCheckFile {
  attachment: File;
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
  idEkyc: string;
}
export interface IPayloadRegister {
  otpConfirmRequest: {
    otp: string;
    id: string;
    isdn: string;
    transactionId: string;
    idEkyc: string;
  };
  file: File;
}
export const handleConvertIsdn = (value: string) => {
  if (value) {
    if (value.startsWith('0') || value.startsWith('84')) {
      return value.replace(/^(0|84)/, '');
    }
  }
  return value;
};
export const getColorStatusApproval = (value: number) => {
  switch (value) {
    case 1:
      return ColorList.SUCCESS;
    case 2:
      return ColorList.WAITING;
    case 4:
      return ColorList.FAIL;
    case 3:
      return ColorList.SUCCESS;
    default:
      return ColorList.CANCEL;
  }
};
