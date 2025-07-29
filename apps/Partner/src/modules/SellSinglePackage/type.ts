export enum PaymentMethod {
  'PAYMENT_METHOD_DEBT' = 'Công nợ với VNSKY',
  'EXCEPT_TKC' = 'Trừ TKC của KH',
}

export enum PaymentMethodValueType {
  'PAYMENT_METHOD_DEBT' = '1',
  'EXCEPT_TKC' = '2',
}
export interface IPackage {
  packageId: string;
  packageCode: string;
  cycle: number;
  unit: string;
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
  idEkyc: string;
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
    idEkyc: string;
  };
  cycle: number | string;
  unit: string;
}
export const handleConvertIsdn = (value: string) => {
  if (value) {
    if (value.startsWith('0') || value.startsWith('84')) {
      return value.replace(/^(0|84)/, '');
    }
  }
  return value;
};
export interface IPayloadCheckIsdnAndGetPackage {
  isdn: string;
  type: string;
}