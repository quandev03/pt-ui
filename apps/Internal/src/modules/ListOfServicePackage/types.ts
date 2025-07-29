export interface ServicePackageItem {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  pckCode: string;
  pckName: string;
  groupType: string;
  pckType: string;
  regType: string;
  profileType: string[];
  fromDate: string | null;
  toDate: string | null;
  apiCode: string;
  apiPromCode: string;
  smsCode: string;
  smsPromCode: string;
  activationCode: string;
  cycleQuantity: number;
  cycleUnit: string;
  displayStatus: boolean | string;
  mobileDisplayPos: number;
  pcDisplayPos: number;
  status: number;
  imageUrl: string;
  topSale: number
}
export interface IServicePackageParams {
  page: number;
  size: number;
  'search-string'?: string;
  'group-type'?: string;
  status?: 0 | 1 | '';
}
export interface GetListResponse<T> {
  data: T[];
}
export interface PayLoadServicePackage {
  saveForm?: boolean;
  id?: number;
  pckCode: string;
  pckName: string;
  groupType: string;
  pckType: string;
  regType: string;
  profileType: string[];
  fromDate?: string;
  toDate?: string;
  apiCode: string;
  apiPromCode: string;
  smsCode: string;
  smsPromCode: string;
  activationCode: string;
  cycleQuantity?: number;
  cycleUnit?: string;
  displayStatus?: boolean;
  mobileDisplayPos?: number;
  pcDisplayPos?: number;
  status: number;
}
export interface PackageProfileResponse<T> {
  status: Status;
  data: Data<T>;
}

export interface Status {
  code: string;
  message: string;
  responseTime: string;
  displayMessage: string;
  properties: any;
}

export interface Data<T> {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  size: number;
  content: T[];
  number: number;
  sort: Sort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface AppPickListResp {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  tableName: string;
  columnName: string;
  code: string;
  value: string | null;
  valueType: string | null;
  refId: number | null;
  status: number;
}
export interface IOption {
  label: string;
  value: string;
}

export interface IPackageError {
  code: string;
  type: string | null;
  title: string;
  detail: string;
  status: number;
  errors: any[];
  data: string[];
}
export interface IPackageGroup {
  label: string | null;
  value: string;
  id?: number;
  refId?: number | null;
}
export interface IErrorData {
  code: string;
  data: string[];
  detail: string;
  errors: any[];
  status: number;
  title: string;
  type: string | null;
}
