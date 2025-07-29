import { ExportRequest } from '../../components/layouts/types';
import { IParamsRequest } from '@react/commons/types';

export interface IItemProduct {
  id?: number;
  productCode: string | number;
  fromSerial: string | number;
  toSerial: string | number;
  quantity: string;
  productName: string;
  productType?: string;
  productId?: string | number;
  createdBy: any;
  createdDate: any;
  modifiedBy: any;
  modifiedDate: any;
  parentId: any;
  productDescription: any;
  productUom: string;
  productStatus: number;
  productCategoryId: any;
  pckCode: any;
  checkQuantity: boolean;
  checkSerial: boolean;
  checkISDN: any;
  productPriceDTOS: any;
  productVatDTOS: any;
  attributeValueList: any;
  validProduct: boolean;

  children?: ISerialItem[];
  isError?: boolean;
}

export interface IFieldsExcel {
  productName: string;
  productCode: string;
  fromSerial: string;
  toSerial: string;
  productUom: string;

  [key: string]: any;
}

export interface IStockMoveLine {
  orgId: number;
  productCode: string;
  fromSerial: string;
  toSerial: string;
  quantity: number;
}

export interface IParamsProducts {
  'value-search': string | null;
  status?: number | null;
}

export interface IBodyFilterSerial {
  productId?: number;
  fromSerial?: number;
  toSerial?: number;
  quantity?: number;
  orgId?: number;
}

export interface IDownoadFile extends ExportRequest {
  params?: string;
}

export type ParamsSearch = IParamsRequest & {
  categoryTypes?: string[];
  categoryIds?: number[];
  orgIds?: number[];
};

export interface ISerialItem {
  productCode?: string;
  productId?: string;
  fromSerial: number;
  toSerial?: string;
  quantity: number;
  orgId: string;
  serialChildrenList?: ISerialItem[];
  checkSerial?: boolean;
}

export interface OrdCurrent {
  orgId: number;
  orgCode: string;
  orgName: string;
  isCurrent: boolean;
}

export interface IFromExportTransaction {
  stockMoveCode: string;
  moveDate: string;
  orgId: number;
  reasonId: number;
  chooseProduct: string;
  files?: File;
  stockMoveLineDTOS: ISerialItem[];
  moveType: number;
  moveMethod: number;
  products?: IItemProduct[];
  ieOrgId: number;
}

export interface IPayloadTransaction {
  stockMoveDTO: IFromExportTransaction;
  attachments?: File;
}

export interface ICatalogReason {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  stt: any;
  reasonId: number;
  reasonTypeCode: string;
  reasonTypeName: string;
  reasonCode: string;
  reasonName: string;
  status: number;
}

export enum TypePage {
  EXPORT = 'export',
  IMPORT = 'import',
  EXPORT_KIT = 'export-kit',
  IMPORT_KIT = 'import-kit',
  EXPORT_SIM = 'export-sim',
  IMPORT_SIM = 'import-sim',
}

export interface ITransaction {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orgId: number;
  ieOrgId: number;
  moveDate: string;
  moveType: number;
  status: number;
  saleOrderId: any;
  saleOrderDate: any;
  deliveryNoteId: any;
  deliveryNoteDate: any;
  description: string;
  stockMoveLineDTOS: StockMoveLineDtos[];
  moveMethod: number;
  orgName: string;
  ieOrgName: string;
  stockMoveCode: string;
  deliveryNoteCode: any;
  attachments: any[];
  reasonDTO: ReasonDto;
}

export interface ReasonDto {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  reasonTypeId: number;
  reasonCode: string;
  reasonName: string;
  status: number;
  description: any;
}

export interface StockMoveLineDtos {
  createdBy: any;
  createdDate: any;
  modifiedBy: any;
  modifiedDate: any;
  id: number;
  orgId: any;
  productCode: any;
  deliveryOrderLineId: any;
  stockMoveId: number;
  moveDate: string;
  productId: number;
  fromSerial: any;
  toSerial: any;
  quantity: number;
  productDTO: ProductDto;
  isCheckSerial: any;
}

export interface ProductDto {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: any;
  productCode: string;
  productName: string;
  productDescription: any;
  productUom: string;
  productType: number;
  productStatus: boolean;
  productCategoryId?: number;
  checkQuantity: any;
  checkSerial: boolean;
  checkISDN: any;
  productPriceDTOS: any;
  productVatDTOS: any;
}

export enum ICategoryProducts {
  PhiHoaMang = '7',
  SimTrang = '1',
  ESim = '2',
  Kit = '3',
  PhiChonSo = '4',
  GoiCuoc = '5',
  DichVu = '6',
}
