import { IParamsRequest } from '@react/commons/types';
import { ApprovedStatusEnum, StatusOrderEnum } from './constants';

export interface IOrderParams extends IParamsRequest {
  orderStatus?: 1 | 2;
  approvalStatus?: 1 | 2;
}

export interface IOrder {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  orgName: string;
  orderNo: string;
  totalAmount: number;
  orderStatus: StatusOrderEnum;
  approvalStatus: ApprovedStatusEnum;
  amountDiscount: number;
  amountTotal: number;
  isGenerateEsim: boolean;
}

export type Cadastral = {
  id: number;
  areaId: number;
  areaCode: string;
  areaName: string;
};

export interface IPayloadCreateOrder {
  saleOrderDTO: IDataOrder;
  attachmentFile: File[];
  attachmentMetadata: IAttachmentMetadata;
}

export interface ISaleOrderDto {
  id: number;
  orgId: number;
  requestOrgId: number;
  orderNo: string;
  customerName: string;
  customerAddress: string;
  description: string;
  amountTotal: number;
  status: number;
  approvalStatus: number;
  stockMoveId: number;
  stockMoveDate: string;
  reasonId: number;
  paymentOption: number;
  shippingMethod: number;
  amountDiscount: number;
  saleOrderLines: IProductInOrder[];
  amountTax: number;
  discountAmount: number;
  customerPhone: string;
  customerTaxCode: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  isCopy: boolean;
  files?: { files: File; desc: string; id?: number }[];
  amountAdditionalDiscount: number;
  businessLicenseAddress?: string;
  createdDate: string;
  receiverPhone: string;
}

export interface SaleOrderLine {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  saleOrderId: number;
  orderDate: string;
  productId: number;
  productName: string;
  productUOM: any;
  quantity: number;
  amountUntaxed: number;
  amountTax: number;
  amountTotal: number;
  invoiceDate: any;
}

export type TypeFormSale = Pick<
  ISaleOrderDto,
  | 'customerAddress'
  | 'customerName'
  | 'customerPhone'
  | 'customerTaxCode'
  | 'description'
  | 'districtCode'
  | 'orgId'
  | 'paymentOption'
  | 'provinceCode'
  | 'reasonId'
  | 'requestOrgId'
  | 'shippingMethod'
  | 'wardCode'
  | 'saleOrderLines'
  | 'files'
  | 'isCopy'
  | 'createdDate'
  | 'receiverPhone'
  | 'businessLicenseAddress'
> & {
  products: IProductInOrder[];
};

export interface IAttachmentMetadata {
  descriptions: string[];
  attachmentCopy: {
    copyId: number;
    description: string;
  }[];
}

export interface ISearchParamsSelectProduct extends IParamsRequest {
  q: string;
  categoryType: string | null;
}

export interface ICalculateDiscountPayload {
  orderDetailInfos: IProductInOrder[];
  amountAdditionalDiscount: number;
}

export interface ICalculateDiscountData {
  orderDetailInfos: IProductInOrder[];
  preferentialLines: IPreferentialLine[];
  amountAdditionalDiscount: number;
  amountProductUntaxed: number;
  amountTax: number;
  amountUntaxed: number;
  amountDiscount: number;
  amountTotal: number;
  amountProduct: number;
}
export interface IPreferentialLine {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: string;
  saleOrderId: string;
  saleOrderLineId: string;
  type: number;
  discountType: number;
  productId: number;
  discountId: number;
  promotionCode: string;
  amount: number;
}

export interface FieldData {
  name: (string | number)[]; // Name của field dưới dạng mảng
  value?: any; // Giá trị của field (optional vì có thể không có)
}

export interface IReason {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  reasonTypeId: number;
  reasonCode: string;
  reasonName: string;
  status: number;
  description: string;
}

export interface IFileDetailOrder {
  objectName: string;
  recordId: string;
}

export interface IResGetFile {
  id: number;
  recordId: number;
  objectName: string;
  fileVolume: number;
  fileName: string;
  fileUrl: string;
  description: string;
  createdBy: string;
  createdDate: string;
}

export interface IDataOrder {
  id?: number;
  requestOrgId: number; // id đối tác
  customerName: string; // tên
  customerAddress: string; // địa chỉ
  description: string; // ghi chú.
  amountUntaxed: number; // tiền trước thuế từ api tính tiền
  amountTax: number; // tiền thuế từ api tính tiền
  amountTotal: number; // tổng tiền từ api tính tiền
  reasonId: number; // lý do id
  paymentOption: number; // phương thức thanh toán
  shippingMethod: number; // phương thức vận chueyenr
  amountDiscount: number; // tổng tiền chiết khấu từ api tính tiền
  createdDate: string; // ngày tạo đơn
  amountAdditionalDiscount: number; // người dùng nhập
  amountProduct?: number; // hiển thị từ api tính tiền
  saleOrderLines: IProductInOrder[];
  preferentialLines?: IPreferentialLine[];
  customerPhone: string; // SĐT
  customerTaxCode: string; //  mã số thuê
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  orderNo?: string;
  isCopy: boolean;
  businessLicenseAddress?: string;
  status?: StatusOrderEnum;
  approvalStatus?: StatusOrderEnum;
  receiverPhone: string;
  isGenerateEsim?: boolean;
}

export interface IProductInOrder {
  productId: number | null; // id sản phẩm
  productCode: string; // mã sản phẩm
  productName: string; // tên sản phẩm
  productUOM: string; // đơn vị sản phẩm
  vat: number; // vat
  price: number; // giá
  categoryId: number; // loại sản phẩm
  categoryCode: string; // mã loại sản phẩm
  categoryName: string; // tên loại sản phẩm
  packageDiscountAmount?: number; // chiết khấu gói
  simDiscountAmount?: number; // chiết khấu sim

  quantity?: number | null; // số lượng
  amountUntaxed?: number; // tổng tiền trước thuế
  amountTax?: number; // tổng tiền thuế
  amountTotal?: number; // tổng tiền sau thuế
  discountId?: number; // id chiết khấu
  amountDiscount?: number; // tiền chiết khấu
  priceId?: number; // id giá từ api sản phẩm
  priceUntaxed?: number; // giá trước thuế từ api tính tiền

  isError?: boolean;
}

export interface IParamsProduct extends IParamsRequest {
  categoryId?: string;
  query?: string;
  isCall?: boolean;
}

export type ICategoryProduct = {
  categoryId: number;
  categoryCode: string;
  categoryName: string;
};
