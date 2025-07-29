import { IParamsRequest } from '@react/commons/types';
export interface TransactionSearchImportExportItem {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  stockMoveCode: string;
  moveMethod: number;
  moveType: number;
  lookUpType: number;
  status: number;
}

export interface IParamsPage extends IParamsRequest {
  stockMoveCode: string;
  moveType: number;
  startDateSearch: string;
  endDateSearch: string;
}
