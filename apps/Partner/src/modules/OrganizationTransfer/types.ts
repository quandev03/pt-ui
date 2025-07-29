import { FileData } from '@react/commons/TableUploadFile';
import { useListWarehouse } from './hooks/useListWarehouse';

export interface ProductType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orgName: string;
  orderNo: string;
  totalAmount: number;
  orderStatus: number;
  approvalStatus: number;
  quantity?: number;
  fromSerial?: number;
  toSerial?: number;
  productId?: number;
  checkSerial?: boolean;
}

export interface OrgTransferType {
  orgId?: number;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orderNo: string;
  fromOrgName: string;
  toOrgName: string;
  approvalStatus: number;
  supplierName: string;
  orderStatus: number;
  moveDate: string;
  ieOrgId: number;
  description: string;
  stockMoveLineDTOS: IStockMoveLineDTO[];
}

export interface FileType extends FileData {
  name: string;
}
export interface IWarehouse {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orgId: number;
  parentId: number | null;
  orgCode: string;
  orgName: string;
  orgType: string;
  orgSubType: string;
  orgDescription: string | null;
  provinceCode: string;
  districtCode: string;
  address: string;
  status: boolean;
  taxCode: string;
  contractNo: string | null;
  contractDate: string | null;
  representative: string;
}
export interface ISerialChild {
  productId: number;
  fromSerial: number;
  toSerial: number;
  quantity: number;
  orgId: number;
}

export interface ISerialType {
  id?: number;
  productId: number;
  fromSerial: number;
  toSerial: number;
  quantity: number;
  orgId: number;
  isChild?: boolean;
  serialChildrenList: ISerialChild[];
  checkSerial?: boolean;
}
export interface IMoveLine {
  productId: number;
  quantity: number;
  fromSerial: number;
  toSerial: number;
}
export interface IDataPayload {
  orgId: number;
  ieOrgId: number;
  moveDate: string;
  description: string;
  moveLines: IMoveLine[];
}

export interface IStockMoveLineDTO {
  createdBy: string | null;
  createdDate: string | null;
  modifiedBy: string | null;
  modifiedDate: string | null;
  id: number;
  orgId: number | null;
  productCode: string | null;
  deliveryOrderLineId: number | null;
  stockMoveId: number;
  moveDate: string;
  productId: number;
  fromSerial: number;
  toSerial: number;
  quantity: number;
  productDTO: ProductDTO;
  isCheckSerial: boolean | null;
}

interface ProductDTO {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: number;
  productCode: string;
  productName: string;
  productDescription: string | null;
  productUom: string;
  productType: number;
  productStatus: boolean;
  productCategoryId: number;
  checkQuantity: boolean;
  checkSerial: boolean;
  checkISDN: boolean;
  productPriceDTOS: any | null;
  productVatDTOS: any | null;
}

export interface IDataDetail {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orgId: number;
  ieOrgId: number;
  moveDate: string;
  moveType: number;
  status: string | null;
  reasonId: number | null;
  saleOrderId: number | null;
  saleOrderDate: string | null;
  deliveryNoteId: number | null;
  deliveryNoteDate: string | null;
  description: string | null;
  stockMoveLineDTOS: IStockMoveLineDTO[];
  moveMethod: string | null;
  orgName: string;
  ieOrgName: string;
  stockMoveCode: string | null;
  deliveryNoteCode: string | null;
  attachments: any | null;
  fromSerial: number;
  toSerial: number;
}

export interface IWarehouseDisabled {
  value: string;
  disabled: boolean;
}

export enum ModalStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum TypeAutoFilterSerial {
  KIT = 3,
}
