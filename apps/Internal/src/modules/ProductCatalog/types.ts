import { ModelStatus } from '@react/commons/types';
import { ActionType } from '@react/constants/app';

export interface AddEditViewProps {
  actionType: ActionType;
}

export interface InformationProps {
  disabled: boolean;
}

export interface AttributeProps {
  disabled: boolean;
  actionType?: ActionType;
}

export interface TableFormProps {
  title: string;
  name: string;
  disabled: boolean;
}

export interface ProductCatalogRequest {
  'value-search'?: string;
  status?: ModelStatus;
}

export type ProductCatalog = {
  id: number;
  parentId: number;
  productCode: string;
  productName: string;
  productUom: string;
  productStatus: ModelStatus;
  categoryName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  productType: ProductType;
  children: ProductCatalog[];
};

export type ProductCatalogDetail = {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: number;
  productCode: string;
  productName: string;
  productDescription: string;
  productDescriptionEn?: string;
  productUom: string;
  productType: ProductType;
  productStatus: ModelStatus;
  productCategoryId: number;
  pckCode: string;
  checkQuantity: boolean;
  checkSerial: boolean;
  checkISDN: boolean;
  productPriceDTOS: ProductDTOS[];
  productVatDTOS: ProductDTOS[];
  attributeValueList: AttributeValue[];
};

export type ProductDTOS = {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  price: number;
  fromDate: string;
  toDate: string;
};

export type AttributeValue = {
  attributeType:string;
  attributeValue: string;
  createdBy: string;
  createdDate: string;
  id: number;
  modifiedBy: string;
  modifiedDate: string;
  productCategoryAttributeId: number;
  productCategoryAttributeValueId: number;
};

export enum ProductType {
  PRODUCT = 1,
  GROUP = 2,
}
export enum AttributeType {
  DYNAMIC = '2',
  PACKAGE_MAIN = '3',
  SIM = '4',
  PACKAGE_SUB = '5',
  COVERAGE_RANGE = '6',
  SKUID = "7",
  SO_NGAY_SU_DUNG = "8",
  CHIA_SE_WIFI = "14",
  NHA_CUNG_CAP = "9",
  DUNG_LUONG_TOC_DO_CAO = "10",
  HET_TOC_DO_CAO_GIAM_XUONG = "13",
  LOAI_GOI = "11",
  EKYC = "12"
}
export type IParamsCoverageRanges = {
  page: number;
  size: number;
  valueSearch?: string;
  status?: CoverageRangeStatus
}
export type ICoverageRangesData =  {
  createdBy: string;
  createdDate: string;
  id: number;
  modifiedBy: string;
  modifiedDate: string;
  rangeCode: string | null;
  rangeName: string;
  rangeType: number;
  status: number;
}
export enum  CoverageRangeStatus{
  ACTIVATE = 1,
  AREA = 2,
}