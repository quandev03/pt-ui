import { IParamsRequest } from '@react/commons/types';
import { ColorList } from '@react/constants/color';
import { Dayjs } from 'dayjs';

export const getProductUom = (value: string) => {
  switch (value) {
    case '01':
      return 'Cái';
    case '02':
      return 'Gói';
    case '03':
      return 'Số';
    case '04':
      return 'Bộ';
    default:
      return value;
  }
};
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
export interface IParamsReport extends IParamsRequest {
  fromDate?: string;
  toDate?: string;
  saleType?: string;
  paymentType?: string;
  valueSearch?: string;
  format?: 'PDF' | 'HTML' | 'XLSX' | 'CSV';
}

export interface IReportOnPackagePurchaseItem {
  id: number;
  orderCode: string;
  isdn: string;
  pckName: string;
  pckCode: string;
  price: number;
  registeredPckTime: string;
  payStatus: number;
  createdDate: string;
  channelName: string;
  description: string;
  orderId: string;
}
export const mappingColor = {
  'Đã thanh toán': ColorList.SUCCESS,
  'Chưa thanh toán': ColorList.CANCEL,
};

export interface IParamsOrgPartner {
  page: number;
  size: number;
  q?: string;
  approvalStatus: number;
  status: number;
}

export const mappingColorRegPckStatus = {
  'Thành công': ColorList.SUCCESS,
  'Thất bại': ColorList.CANCEL,
};
