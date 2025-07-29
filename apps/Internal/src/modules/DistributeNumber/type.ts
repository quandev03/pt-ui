export interface IApprovalStep {
  id: number;
  objectName?: string;
  recordId?: number;
}

export interface IPhoneNumberSelect {
  id: number;
  isdn: number;
  generalFormat: any;
  groupCode: string;
}

export interface IProcessApproved {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  id: number;
  approvalStepId: number;
  approvedDate: string;
  status: number;
  approvedUserId: string;
  description: string;
  approvalHistoryId: number;
  stepOrder: number;
  approvedUserName: string;
  mandatorUserId: any;
  mandatorUserName: any;
}
