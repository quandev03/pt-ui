export interface PersonalRoles  {
  code: string;
  id: string;
  name: string;
  status: number
}

export interface ApprovalProcessType {
  id: number;
  processName: string;
  orgId: number;
  stepOrder: number;
  userId: string;
  userName: string;
}

export interface ApprovalDelegateType {
  id: string;
  delegateUserId: string;
  delegateUserName: string;
  fromDate: string;
  toDate: string;
}

export interface ApprovalStepDelegate {
  processName: string;
  approvalStepDelegates: ApprovalDelegateType[];
}
