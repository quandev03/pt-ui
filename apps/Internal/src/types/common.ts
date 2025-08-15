export type ParamKeys =
  | 'STOCK_ISDN_STATUS'
  | 'STOCK_ISDN_TRANSFER_STATUS'
  | 'PARTNER_TYPE'
  | 'PARTNER_SUB_TYPE'
  | 'PARTNER_APPROVAL_STATUS'
  | 'PARTNER_STATUS';
export interface IOrgItem {
  id: string;
  orgCode: string;
  orgName: string;
  parentId: string;
  createdBy: string;
}
