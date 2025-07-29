export interface IInventoryDetail {
  id: string;
  productCategoryName: string;
  productCode: string;
  productName: string;
  productUom: string;
  quantity: number;
}

export interface ParamsInventoryDetail {
  page: number;
  size: number;
  inventoryCode: string;
}

export const paramsDefault: ParamsInventoryDetail = {
  page: 0,
  size: 20,
  inventoryCode: '',
};

export interface IOrgUser {
  orgId: number;
  orgCode: string;
  orgName: string;
  isCurrent: boolean;
}

export interface Req {
  process_code: number[];
  status: number[];
  status_last: number[];
  from_date: string;
  to_date: string;
  page: number;
  size: number;
}

export const defaultPageSizeOptions = [20, 50, 100];
