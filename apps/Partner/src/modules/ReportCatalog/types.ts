import { IParamsRequest } from '@react/commons/types';
import { ColorList } from '@react/constants/color';

export interface IParamsReport extends IParamsRequest {
  fromDate?: string;
  toDate?: string;
  saleType?: string;
  paymentType?: string;
  valueSearch?: string;
  format?: 'PDF' | 'HTML' | 'XLSX' | 'CSV';
}

export enum ISaleMethod {
  SINGLE = 'SINGLE',
  BATCH = 'BATCH',
}

export enum IPaymentMethod {
  DEBT_VNSKY = 'DEBT_VNSKY',
  TKC_OF_KH = 'TKC_OF_KH',
}
export interface IType {
  id: number;
  type: string;
  code: string;
  name: string;
  dataType: string;
  value: string;
  status: number;
  statusOnline: number;
}

export const getListType = () => {
  return [
    {
      id: 155,
      type: 'SUB_CHARGE_PACKAGE',
      code: 'SINGLE',
      name: 'Đơn lẻ',
      dataType: 'String',
      value: 'SALE_TYPE',
      status: 1,
      statusOnline: 1,
    },
    {
      id: 156,
      type: 'SUB_CHARGE_PACKAGE',
      code: 'BATCH',
      name: 'Theo lô',
      dataType: 'String',
      value: 'SALE_TYPE',
      status: 1,
      statusOnline: 1,
    },
    {
      id: 157,
      type: 'SUB_CHARGE_PACKAGE',
      code: 'VNSKY_DEBT',
      name: 'Trừ công nợ VnSky',
      dataType: 'String',
      value: 'PAYMENT_TYPE',
      status: 1,
      statusOnline: 1,
    },
    {
      id: 158,
      type: 'SUB_CHARGE_PACKAGE',
      code: 'MAIN_WALLET',
      name: 'Trừ vào tài khoản gốc',
      dataType: 'String',
      value: 'PAYMENT_TYPE',
      status: 1,
      statusOnline: 1,
    },
  ];
};
export const getColorStatusApproval = (value: number) => {
  switch (value) {
    case 1:
      return ColorList.SUCCESS;
    case 2:
      return ColorList.PROCESSING;
    default:
      return ColorList.CANCEL;
  }
};
