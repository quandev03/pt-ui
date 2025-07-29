export interface ISerialLookup {
  id: string;
  serial: string;
  isDn: string;
  productCode: string;
  productName: string;
  orgCode: string;
  orgName: string;
  status: number;
  kitStatus: number;
  qr: any;
}

export interface ParamsSerialLookup {
  page: number;
  size: number;
  isDn: string;
  orgIds: string;
  productIds: string;
  fromSerial: number | undefined;
  toSerial: number | undefined;
  kitStatus: string | undefined;
  status: number | undefined;
}

export interface IOrg {
  orgId: number;
  orgName: string;
}

export interface IProduct {
  categoryName: string | null;
  children: string | null;
  createdBy: string | null;
  createdDate: string | null;
  id: string | number;
  modifiedBy: string | null;
  modifiedDate: string | null;
  parentId: string | number;
  productCode: string;
  productName: string;
  productStatus: string | null;
  productType: string | null;
  productUom: string | null;
  productUomValue: string | null;
}

export const defaultPageSizeOptions = [20, 50, 100];

export interface Req {
  process_code: number[];
  status: number[];
  status_last: number[];
  from_date: string;
  to_date: string;
  page: number;
  size: number;
}
