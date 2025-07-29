export interface IParamsInternalExportProposal {
    page: number;
    size: number;
    q?: string;
    orderStatus?: string;
    deliveryOrderType?: string
}
interface DeliveryOrderLineDTO {
    orderDate: string;
    quantity: number;
    productCode: string;
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
export interface IDataListInternalExportProposal {
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
}
export interface IStockOut {
    id: string;
    orgName: string;
}
export interface IStockIn {
    id: number;
    name: string;
    parentId: null;
    nameParent: null;
    isCurrent: boolean
}
export interface IReason {
    reasonId: number; // Unique identifier
    reasonTypeCode: string; // Code for the reason type
    reasonTypeName: string; // Name of the reason type
    reasonCode: string; // Code for the reason
    reasonName: string; // Name of the reason
    status: number; // Status code
}
export interface IItemProduct {
    id: number;
    productCode: string; // Code of the product
    productName: string; // Name of the product
    productUom: string; // Unit of measurect
    quantity: number; // Quantity of the product
}
export interface IParamsProducts {
    "value-search"?: string,
    page: number,
    size: number
}
export const DEFAULT_SEARCH_PARAMS = {
    'value-search': null,
    status: null,
};
export interface IDataPayloadDTO {
    fromOrgId: number; // ID tổ chức gửi
    toOrgId: number; // ID tổ chức nhận
    orderDate: string; // Ngày đặt hàng
    orderType: number; // Loại đơn hàng
    orderStatus: number; // Trạng thái đơn hàng
    orderNo: string; // Số đơn hàng
    reasonId: number; // ID lý do
    saleOrderId: number; // ID đơn hàng bán
    saleOrderDate: string; // Ngày đơn hàng bán
    description: string; // Mô tả
    deliveryOrderType: number; // Loại đơn giao hàng
    deliveryOrderLineDTOS: DeliveryOrderLineDTO[]; // Danh sách các dòng đơn giao hàng
    attachmentsDTOS: IAttachmentDTO[];
    files: File[];
}
export const getCurrentStatusColorApproval = (code: number) => {
    switch (code) {
        case 1:
            return "yellow";
        case 2:
            return "green";
        case 3:
            return "red";
        default:
            return "gray";
    }
};
export interface IProductDTO {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    parentId: number | null;
    productCode: string;
    productName: string;
    productDescription: string | null;
    productUom: string;
    productType: number;
    productStatus: boolean;
    productCategoryId: number | null;
    checkQuantity: boolean | null;
    checkSerial: boolean | null;
    checkISDN: boolean | null;
    productPriceDTOS: any | null; // Thay thế bằng kiểu dữ liệu cụ thể nếu có
    productVatDTOS: any | null; // Thay thế bằng kiểu dữ liệu cụ thể nếu có
}
export interface IDeliveryOrderLineDTO {
    id: number;
    deliveryOrderId: number;
    orderDate: string;
    productId: number;
    fromSerial: string | null;
    toSerial: string | null;
    quantity: number;
    deliveriedQuantity: number | null;
    productDTO: IProductDTO;
    productCode: string | null;
    version: number;
}
export interface IDataDetailInternalExportProposal {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    supplierId: number | null;
    fromOrgId: number;
    toOrgId: number;
    requestOrgId: number | null;
    approvalOrgId: number | null;
    orderDate: string;
    orderType: number;
    orderStatus: number;
    approvalStatus: number;
    orderNo: string | null;
    poContractNo: string | null;
    internalDocNo: string | null;
    internalDocLink: string | null;
    reasonId: number;
    haveSale: boolean | null;
    saleOrderId: number | null;
    saleOrderDate: string | null;
    saleStatus: number | null;
    poDate: string | null;
    poNo: string | null;
    description: string;
    deliveryOrderType: number | null;
    deliveryOrderLineDTOS: IDeliveryOrderLineDTO[];
    attachmentsDTOS: IAttachmentDTO[];
}
export const getColorStatusApproval = (value: number) => {
    switch (value) {
        case 1:
            return "yellow"
        case 2:
            return "blue"
        case 3:
            return "green"
        case 4:
            return "red"
        case 5:
            return "red"
        default:
            return "gray"
    }
}
export const getLabelStatusApproval = (value: number) => {
    switch (value) {
        case 1:
            return "Chờ phê duyệt"
        case 2:
            return "Đang phê duyệt"
        case 3:
            return "Đã phê duyệt"
        case 4:
            return "Từ chối"
        case 5:
            return "Hủy"
        default:
            return "Không xác định"
    }
}


//  bắt đầu từ đây
export const getLabelDeliveryNoteType = (value: number) => {
    switch (value) {
        case 1:
            return "Phiếu xuất"
        case 2:
            return "Phiếu nhập"
        default:
            return "Không xác định"
    }
}
