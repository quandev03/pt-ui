export interface IEximDistributorContent {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orderNo: string;
  fromOrgId: string;
  toOrgId: string;
  moveType: number;
  moveMethod: number;
  reasonName: string;
}

export interface ProductDTO {
  id: number | null;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  parentId: number | null;
  productId: number;
  productCode: string;
  productName: string;
  productDescription: string;
  productUom: string;
  productType: number | null;
  productStatus: boolean;
  productCategoryId: number | null;
  checkQuantity: string;
  checkSerial: string;
  checkISDN: string;
  productPriceDTOS: string;
  productVatDTOS: string;
  orgId: number;
  quantity: number;
  fromSerial: number;
  toSerial: number | string;
  error: string | null
}

interface DeliveryNoteLineDTO {
  id: number | null;
  deliveryOrderLineId: number | null;
  saleOrderLineId: number | null;
  deliveryNoteId: number | null;
  deliveryNoteDate: string;
  productId: number | null;
  fromSerial: string;
  toSerial: string;
  quantity: number | null;
  productDTO: ProductDTO;
}

export interface IDeliveryNoteItem {
  approvalStatus: number | null;
  attachmentsDTOS: [];
  createdBy: string;
  createdDate: string;
  delivererName: string;
  deliveryNoteCode: string;
  deliveryNoteDate: string;
  deliveryNoteLineDTOList: [DeliveryNoteLineDTO];
  deliveryNoteMethod: number | null;
  deliveryNoteType: number | null;
  deliveryOrderDate: string;
  deliveryOrderId: number | null;
  description: string;
  fromOrgId: number | null;
  id: number | null;
  modifiedBy: string;
  modifiedDate: string;
  reasonId: number | null;
  recipientName: string;
  saleOrderDate: string;
  saleOrderId: number | null;
  status: number | null;
  supplierId: number | null;
  toOrgId: number | null;
}

export interface IColumnListEximDistributor {
  id: string;
  deliveryNoteCode: string;
  orderNo: string;
  moveMethod: string;
  createdDate: string;
  createdBy: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface IColumnListProduct {
  id: number;
  productCode: string;
  productName: string;
  productUom: string;
  quantity: number;
  fromSerial: string;
  toSerial: string;
  productDescription: string;
  productType: number;
  checkSerial: boolean;
  initialQuantity: number
  children: []
  checkHidden: boolean
}

export interface IEximDistributorItem {
  content: IEximDistributorContent[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  size: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface IListSerialNumber {
  productId: number,
  orgId: number,
  fromSerial: number,
  toSerial: number,
  quantity: number,
  serialChildrenList: []
  productDescription: string
  checkSerial: boolean
}

export enum StatusEximDistributorList {
  CREATE = 1,
  EXPORT = 2,
  CANCEL = 3
}

