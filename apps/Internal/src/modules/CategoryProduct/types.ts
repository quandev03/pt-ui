import { IParamsRequest } from "@react/commons/types";
import { ColorList } from "@react/constants/color";

export interface ICategoryProductParams extends IParamsRequest {
  status?: string;
}

export interface ICategoryProduct {
  id: number;
  categoryCode: string;
  categoryName: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  statusName: string;
  status: boolean;
  description: string;
  categoryType: number;
  productCategoryAttributeDTOS?: IProductCategoryAttributeDTOS[];
}

export interface IListCategoryType {
  code: string;
  createdBy: string;
  createdDate: string;
  id: number;
  modifiedBy?: string;
  modifiedDate?: string;
  refId?: string;
  value: string;
  valueType?: string;
}

interface IProductCategoryAttributeDTOS {
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  id?: string;
  productCategoryId?: string;
  attributeCode: string;
  attributeName: string;
  attributeType?: string;
  associateWithProduct: boolean;
  productCategoryAttributeValueDTOS: IProductCategoryAttributeValueDTOS[];
}

interface IProductCategoryAttributeValueDTOS {
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  id?: string;
  value: string;
  valueType: string;
  productCategoryAttributeId?: string;
  associateWithProduct: boolean;
  valueEn?: string;
}

export interface PayloadCreateUpdateCategoryProduct {
  id?: string;
  categoryCode: string,
  categoryName: string,
  status: boolean,
  description: string,
  categoryType: {
    value: number,
  } | number,
  productCategoryAttributeDTOS?: IProductCategoryAttributeDTOS[]
}

export const mappingColor = {
  '1': ColorList.SUCCESS,
  '0': ColorList.CANCEL,
};

export enum TypeAttribute {
  GOI_CUOC_DEM = '5',
  DONG = '2',
  GOI_CUOC_CHINH = '3',
  LOAI_SIM = '4',
}
export enum ProductTypeGroup {
  SIM_VAT_LY = "1",
  ESIM = "2",
  KIT = "3",
  PHI_CHON_SO = "4",
  GOI_CUOC = "5",
  DICH_VU = "6",
  PHI_HOA_MANG = "7"
}
