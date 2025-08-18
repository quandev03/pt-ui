import { AnyElement, IParamsRequest } from '@vissoft-react/common';

export type IPartnerCatalogParams = IParamsRequest & {
  partnerType?: string;
  status?: string;
  approvalStatus?: string;
};
export type ICatalogPartner = {
  id: number;
  orgName: string;
  orgCode: string;
  orgPartnerType?: string;
  createdBy: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
  status: number;
  approvalStatus: number;
};

export interface IPayloadPartner {
  id?: number | string;
  organizationUnitDTO: IPartner;
}

export interface IOrganizationUnitDTO {
  id?: number | string;
  parentId?: number;
  orgCode: string;
  orgName: string;
  orgType: string;
  orgSubType: string;
  orgDescription: string;
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  address?: string;
  status?: number | string;
  approvalStatus?: number | string;
  taxCode: string;
  contractNo: string;
  contractDate: string;
  representative?: string;
  phone: string;
  email: string;
  orgPartnerType: string;
  orgBankAccountNo: string;
  contractNoFileUrl?: string;
  businessLicenseFileUrl?: string;
  businessLicenseNo?: string;
  businessLicenseAddress: string;
  deliveryInfos?: IDeliveryInfo[];
  contractNoFileLink?: Blob;
  businessLicenseFileLink?: Blob;
  clientId?: string;
  idCardFrontSiteFileLink?: Blob;
  idCardBackSiteFileLink?: Blob;
  multiFileLink?: Blob;
}

export interface IDeliveryInfo {
  id?: number;
  orgId?: number | string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  address?: string;
  consigneeName: string;
  orgTitle: string;
  idNo: string;
  idDate: string;
  idPlace: string;
  idCardFrontSiteFileUrl?: string;
  idCardBackSiteFileUrl?: string;
  multiFileUrl?: string;
  gender: string;
  dateOfBirth: string | null;
  email: string;
  phone: string;
  passportNo: string;
  status?: boolean;
  idCardFrontSiteFileLink?: Blob;
  idCardBackSiteFileLink?: Blob;
  multiFileLink?: Blob;
  consigneeAddress: string;
}

export interface IFormData {
  address: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  contractFile: File;
  businessLicenseFile: File;
  orgSubType: string;
  orgPartnerType: string;
  orgCode: string;
  orgName: string;
  contractNo: string;
  taxCode: string;
  contractDate: string;
  email: string;
  orgBankAccountNo: string;
  phone: string;
  businessLicenseAddress: string;
  orgDescription: string;
  idCardFrontSite: File;
  idCardBackSite: File;
  portrait: File;
  consigneeName: string;
  idNo: string;
  idPlace: string;
  idDate: string;
  gender: string;
  dateOfBirth: string;
  passportNo: string;
  phoneOrganizationDeliveryInfoDTO: string;
  emailOrganizationDeliveryInfoDTO: string;
  orgTitle: string;
  consigneeAddress: string;
}

export interface IParamsProductByCategory extends IParamsRequest {
  categoryId: number | string;
}

export interface IProductAuthorization {
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  productInfos: ProductInfo[];
  categoryStatus: 0 | 1;
}

interface ProductInfo {
  productId: number;
  productCode: string;
  productName: string;
  price: number;
  vat: number;
  productUom: string;
  productStatus: 0 | 1;
}

export interface ICCCDInfo {
  document: string;
  name: string;
  id: string;
  issue_by: string;
  issue_date: string;
  birthday: string;
  sex: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  expiry: string;
  id_ekyc: string;
  check_sendOTP: boolean;
  list_phoneNumber: string[];
  c06_required: boolean;
  total_sim: number;
}

export interface IStockNumberParams {
  stockType?: number[];
  requireAccess?: boolean;
}

export interface IStockNumber {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  parentId: number;
  stockCode: string;
  stockName: string;
  salesChannels: string;
  deliveryAreas: any;
  stockType: number;
  status: number;
  description: string;
  stockIsdnOrgPermissionDTOS: any;
  organizationUnitDTOS: any;
}
export interface ChildRef {
  clearImage: () => void;
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

export interface IUserPartnerCatalog {
  id: string | undefined;
  fullName: string;
  userName: string;
  status: boolean;
  createdBy: string;
  createdDate: string | Date | null;
  lastModifiedBy: string;
  lastModifiedDate: string | Date | null;
  roles: IRoleItem[];
}

export interface DataPayloadCreateUpdateUserPartnerCatalog {
  username: string;
  password: string;
  fullname: string;
  status: number;
  roleIds: string[];
  samplingDivision: string;
  samplingUnitId: string;
  id?: string;
  type?: string;
}

export interface IRoleItem {
  code: string;
  id: string;
  name: string;
  status: number;
}
export interface IListOfServicePackage {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: string;
  pckCode: string;
  pckName: string;
  packagePrice: number;
  status: number;
  description: string;
}
export interface IPartner {
  id?: string;
  orgCode: string;
  orgName: string;
  taxCode: string;
  phone: string;
  address: string;
  representative: string;
  status: number | string;
  orgDescription?: string;
}
export interface IRoleItem {
  code: string;
  id: string;
  name: string;
  status: number;
}
export interface IAssignPackagePayload {
  id: string | number;
  packageIds: string[];
}
