import dayjs from 'dayjs';

export interface IReason {
  id: number;
  reasonName: string;
  reasonCode: string;
}
export interface IStockIsdn {
  id: number; // ID của đối tượng
  isdn: number; // Số ISDN
  generalFormat: string; // Định dạng chung
  groupCode: string; // Mã nhóm
}

export interface IPramsRecallNumber {
  page: number;
  size: number;
  'process-type': number;
  'stock-id': number;
  'ie-stock-id': number;
  from: string;
  to: string;
  rangePicker: dayjs.Dayjs[];
}

export interface IStockNumber {
  id: number;
  isdn: number;
  generalFormat: string;
  groupCode: string;
}
