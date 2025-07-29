export interface ContentItem {
  id: string;
  parentId: number;
  code: string;
  value: string;
}

export interface IParams {
  moveType?: number;
  processType?: number;
  stockId?: number;
  desStockId?: number;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

export interface IListNumber {
  id: string;
  isdn: number;
  groupFormat: string | null;
  groupCode: string | null;
}

export interface IStockNumber {
  id: number;
  isdn: number;
  generalFormat: string;
  groupCode: string;
}
