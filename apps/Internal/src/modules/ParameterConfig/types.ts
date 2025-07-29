export interface ICategoryParameterConfig {
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
  id: number;
  tableName: string;
  columnName: string;
  status: number;
  code: string;
  value: string;
  valueType: string;
  refId: any;
  isDefault: boolean;
}

export interface PayloadAddParameterConfig {
  id?: number;
  tableName: string;
  columnName: string;
  code: string;
  value: string;
  valueType?: string;
  refId: string;
  status: number;
  isDefault?: boolean
}

export interface PayloadUpdateParameterConfig {
  id: string;
  data: PayloadAddParameterConfig;
}

export enum IDataType {
  NUMBER = 'NUMBER',
  BOOLEAN = 'COD',
  STRING = 'MOMO',
  NULL = 'NULL',
  UNDEFINED = 'UNDEFINED',
  OBJECT = 'OBJECT',
}

export enum EDefault {
  YES = 'YES',
  NO = 'NO',
}

export enum EStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}
