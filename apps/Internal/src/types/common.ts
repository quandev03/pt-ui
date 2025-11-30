export type ParamKeys =
  | 'STOCK_ISDN_STATUS'
  | 'STOCK_ISDN_TRANSFER_STATUS'
  | 'PARTNER_TYPE'
  | 'PARTNER_SUB_TYPE'
  | 'PARTNER_APPROVAL_STATUS'
  | 'PARTNER_STATUS'
  | 'ISDN_TRANSACTION_TRANS_STATUS'
  | 'ISDN_TRANSACTION_UPLOAD_STATUS'
  | 'SUBSCRIBER_SUBS_STATUS'
  | 'SUBSCRIBER_SUB_STATUS'
  | 'SUBSCRIBER_ACTIVE_SUB_STATUS'
  | 'ACTION_HISTORY_ACTION_CODE'
  // Loại dịch vụ phòng cho gói cước
  | 'PACKAGE_SERVICE_ROOM';
export interface IOrgItem {
  id: string;
  orgCode: string;
  orgName: string;
  parentId: string;
  createdBy: string;
}
