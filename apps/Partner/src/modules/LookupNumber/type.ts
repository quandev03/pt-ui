export interface ExportRequest {
  uri: string;
  filename?: string;
}
export enum NumberStockTypes {
  GENERAL = 1, // Kho so chung
  SPECIFIC = 2, // Kho so rieng
  SALE = 3, // Kho ban hang
  CANCEL_AWAITING = 4, // Kho cho huy
  CANCELED = 5, //Kho hoan huy
}
export interface INumberStock {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: number | null;
  stockCode: string;
  stockName: string;
  stockType: number;
  status: number;
  description: string | null;
}
export interface TableFormProps {
  title: string;
  name: string;
  disabled: boolean;
}
export interface IPhoneNumberItem {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
export interface IState {
  status: boolean;
  isdn: string;
}

export type FormSearch = {
  startDate: Date;
  endDate: Date;
};

export type PropsModal = {
  open: boolean;
  onClose: () => void;
  isdn: string;
};

export interface IParameter {
  'value-search'?: string;
  'stock-id'?: number;
  status?: number;
  'transfer-status'?: number;
  reload?: boolean;
  page: number;
  size: number;
}
export interface IParameterDate {
  'from-date'?: string;
  'to-date'?: string;
}
export interface IStatus {
  'table-name': string;
  'column-name': string;
}

export interface IRequest extends ExportRequest {
  params?: any;
}
