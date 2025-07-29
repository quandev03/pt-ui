export interface ProductType {
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    id: number;
    orgName: string;
    orderNo: string;
    totalAmount: number;
    orderStatus: number;
    approvalStatus: number;
    quantity?: number;
}
export interface IStockPeriod {
    productCode: string;
    productName: string;
    productUom: string | null;
    beginningBalance: number;
    inPeriodReceived: number;
    inPeriodSold: number;
    endingBalance: number;
}