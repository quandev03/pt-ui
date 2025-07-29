import { AnyElement, IParamsRequest } from '@react/commons/types';

export enum StatusCoverageAreaEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ALL = 'ALL',
}

export enum CoverageScopeEnum {
  COUNTRY = 1,
  REGION = 2,
}

export interface ICoverageAreaParams extends IParamsRequest {
  status?: StatusCoverageAreaEnum;
  name?: string;
  rangeType?: string;
  valueSearch?: string;
}
export interface INationItem {
  createdBy: string;
  createdDate: string;
  description: string | null;
  id: number;
  imgUrl: string;
  modifiedBy: string;
  modifiedDate: string;
  nations: any | null;
  parentId: number;
  rangeCode: string;
  rangeName: string;
  rangeType: number;
  status: number;
}
export interface ICoverageAreaItem {
  id?: number;
  rangeCode: string;
  rangeName: string;
  rangeType: CoverageScopeEnum;
  description: string;
  status: number;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  avatar: string;
  imgUrl: string;
  nations: INationItem[];
}

export interface IFormCoverageArea {
  id?: number;
  rangeCode: string;
  rangeName: string;
  rangeType: CoverageScopeEnum;
  description: string;
  status?: number | boolean;
  avatar?: AnyElement;
  nations: ICountry[] | INationItem[];
  nationsIds: number[];
}
export interface IRangeType {
  id: number;
  code: string;
  value: string;
}
export interface ICountry {
  id: number;
  rangeCode: string;
  rangeName: string;
}
