import { ModelStatus } from "@react/commons/types";
import { StatusOrderEnum } from "../Order/constants";
import { ColorList } from "@react/constants/color";

export enum DeliveryNoteMethod {
    EXPORT = "Xuất",
    IMPORT = "Nhập",
    RECAL = "Thu hồi",
    RETURN = "Trả hàng"
}
export const optionDeliveryNoteMethod = [
    { value: 1, label: DeliveryNoteMethod.EXPORT },
    { value: 2, label: DeliveryNoteMethod.IMPORT },
    { value: 3, label: DeliveryNoteMethod.RECAL },
    { value: 4, label: DeliveryNoteMethod.RETURN },
]
export interface IParamStockOutForDistributor {
    deliveryNoteMethod: DeliveryNoteMethod;
    deliveryNoteType: number;
    q?: string;
    page: number,
    size: number,
    fromDate?: string,
    toDate?: string
}
export interface IStockOutForDistributorck {
    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;
    id: string;
    deliveryNoteCode: string;
    orderNo: string;
    orgName: string;
    deliveryNoteType: number;
    approvalStatus: number;
    status?: number;
}
export interface IReason {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    stt?: string;
    reasonId: number;
    reasonTypeCode: string;
    reasonTypeName: string;
    reasonCode: string;
    reasonName: string;
    status: number;
}
export const renderDeliveryNoteMethod = (value: number) => {
    switch (value) {
        case 1: return "Xuất"
        case 2: return "Nhập"
        case 3: return "Thu hồi"
        case 4: return "Trả hàng"
        default: return ""
    }
}
export const renderApprovalStatus = (value: number) => {
    switch (value) {
        case 1: return ModelStatus.ACTIVE
        case 2: return ModelStatus.INACTIVE
        default: return ""
    }
}
export interface IPayloadStockOutForDistributor {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    deliveryOrderId: number;
    deliveryOrderDate: string;
    saleOrderId: number;
    saleOrderDate: string;
    supplierId: number;
    fromOrgId: number;
    toOrgId: number;
    deliveryNoteCode: string;
    deliveryNoteDate: string;
    deliveryNoteType: number;
    delivererName: string;
    recipientName: string;
    status: number;
    reasonId: number;
    description: string;
    approvalStatus: number;
    deliveryNoteLines: IDeliveryNoteLineDTO[];
    attachments: IAttachmentDTO[];
    deliveryNoteMethod: number;
}

export interface IDeliveryNoteLineDTO {
    id: number;
    deliveryOrderLineId: number;
    saleOrderLineId: number;
    deliveryNoteId: number;
    deliveryNoteDate: string;
    productId: number;
    fromSerial: string;
    toSerial: string;
    quantity: number;
    productDTO: IProductDTO;
}

export interface IProductDTO {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    parentId: number;
    productCode: string;
    productName: string;
    productDescription: string;
    productUom: string;
    productType: number;
    productStatus: boolean;
    productCategoryId: number;
    checkQuantity: boolean;
    checkSerial: boolean;
    checkISDN: boolean;
    productPriceDTOS: IProductPriceDTO[];
    productVatDTOS: IProductVatDTO[];
}

export interface IProductPriceDTO {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    price: number;
    fromDate: string;
    toDate: string;
}

export interface IProductVatDTO {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    price: number;
    fromDate: string;
    toDate: string;
}

export interface IAttachmentDTO {
    id: number;
    recordId: number;
    orgId: number;
    objectName: string;
    fileVolume: number;
    fileName: string;
    fileUrl: string;
    description: string;
    createdBy: string;
    createdDate: string;
}
export interface IWarehouseExport {
    id: string;
    isCurrent?: boolean;
    name: string;
    nameParent?: string;
    parentId?: string
}
export interface IStockCurrentUserPermission {
    orgId: number;
    orgCode: string;
    orgName: string;
    isCurrent: boolean;
}
export const renderStatus = (value: number) => {
    switch (value) {
        case 1: return "Tạo mới"
        case 2: return "Đã xuất"
        case 3: return "Hủy phiếu"
        default:
            break;
    }
}
export const mappingColorStatus = {
    '1': ColorList.WAITING,
    '2': ColorList.SUCCESS,
    '3': ColorList.FAIL,
};
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
    paymentMethod: number; // phương thức thanh toán
    shippingMethod: number; // phương thức vận chueyenr
    amountDiscount: number; // tổng tiền chiết khấu từ api tính tiền
    amountAdditionalDiscount: number; // người dùng nhập
    amountProduct?: number; // hiển thị từ api tính tiền
    saleOrderLines: IProductInOrder[];
    customerPhone: string; // SĐT
    customerTaxCode: string; //  mã số thuê
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    isCopy: boolean;
    status?: StatusOrderEnum;
    approvalStatus?: StatusOrderEnum;
    orderDate?: string;
    orgName?: string;
    orderNo?: string;
}

export interface IProductInOrder {
    id?: string;
    productId: number | null; // id sản phẩm
    productCode: string; // mã sản phẩm
    productName: string; // tên sản phẩm
    productUOM: string; // đơn vị sản phẩm
    vat: number; // vat
    price: number; // giá
    categoryId: number; // loại sản phẩm
    categoryCode: string; // mã loại sản phẩm
    categoryName: string; // tên loại sản phẩm
    quantity?: number; // số lượng
    amountUntaxed?: number; // tổng tiền trước thuế
    amountTax?: number; // tổng tiền thuế
    amountTotal?: number; // tổng tiền sau thuế
    discountId?: number; // id chiết khấu
    amountDiscount?: number; // tiền chiết khấu
    priceId?: number; // id giá từ api sản phẩm
    priceUntaxed?: number; // giá trước thuế từ api tính tiền
    remainQuantity?: number;
}
export enum StatusStockOutForDistributor {
    CREATE = 1,
    EXPORT = 2,
    CANCEL = 3
}
export enum CategoryType {
    SimTrang = 1,
    Esim = 2,
    Kit = 3,
    PhiChonSo = 4,
    GocCuoc = 5,
    DichVu = 6
}
